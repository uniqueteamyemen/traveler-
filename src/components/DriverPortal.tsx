import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { YEMEN_GOVERNORATES } from '../data/yemenData';
import { PlannedStop, TransportOffice, FleetVehicle, OfficeBranch, InterCityTripListing, RoadAlertReason, SocialCampaignType } from '../types/travel';
import { CompanyShowcaseModal } from './modals/CompanyShowcaseModal';
import { FamilyLiveTrackingModal } from './modals/FamilyLiveTrackingModal';
import { liveTrackingService } from '../services/liveTrackingService';
import { CaptainOwnerOnboarding } from './CaptainOwnerOnboarding';
import { CaptainOwnerDashboard } from './CaptainOwnerDashboard';
import { DriverGarageManager } from './DriverGarageManager';
import { DriverSMSPortal } from './DriverSMSPortal';
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
  Briefcase,
  Building2,
  Share2,
  Trash2,
  Edit,
  Eye,
  Radio,
  Lock,
  AlertTriangle,
  Smartphone,
  Send,
  Navigation,
  Copy,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const DriverPortal: React.FC = () => {
  const { 
    lang, 
    addIntercityListing, 
    setActiveTab, 
    transportOffices, 
    addTransportOffice, 
    updateTransportOffice, 
    addFleetVehicleToOffice,
    addNotification,
    userProfile,
    driverVehicles
  } = useTravel();

  const isProfileComplete = Boolean(
    userProfile?.isProfileComplete && 
    (userProfile?.primaryPhone || userProfile?.phoneNumber) &&
    driverVehicles.length > 0
  );

  const [activeTabSub, setActiveTabSub] = useState<
    'dashboard' | 'register' | 'garage' | 'sms_portal' | 'offices_mgmt' | 'live_broadcast' | 'why_join' | 'verification'
  >('dashboard');
  const [successMessage, setSuccessMessage] = useState(false);

  // Live Broadcast State for Captain
  const [captainTripCode, setCaptainTripCode] = useState('YEM-AD-MK-772');
  const [isCaptainBroadcasting, setIsCaptainBroadcasting] = useState(false);
  const [captainCityLocation, setCaptainCityLocation] = useState('محافظة إب — نقيل سمارة');
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [captainAlertReason, setCaptainAlertReason] = useState<RoadAlertReason>('rain_floods');
  const [captainAlertText, setCaptainAlertText] = useState('');
  const [alertSuccessToast, setAlertSuccessToast] = useState(false);

  // Company Preview Modal State
  const [previewOffice, setPreviewOffice] = useState<TransportOffice | null>(null);
  const [isPreviewOfficeOpen, setIsPreviewOfficeOpen] = useState(false);

  // Links & Invites State
  const [copiedCaptainLink, setCopiedCaptainLink] = useState(false);
  const [copiedPassengerLink, setCopiedPassengerLink] = useState(false);

  const getCaptainInviteUrl = () => {
    if (typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null') {
      return `${window.location.origin}/?portal=captains`;
    }
    return 'https://deterministicsolutionsdesign.com/?portal=captains';
  };

  const getPassengerInviteUrl = () => {
    if (typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null') {
      return `${window.location.origin}/?portal=passenger`;
    }
    return 'https://deterministicsolutionsdesign.com/?portal=passenger';
  };

  const handleCopyCaptainLink = () => {
    const url = getCaptainInviteUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopiedCaptainLink(true);
      setTimeout(() => setCopiedCaptainLink(false), 3000);
      addNotification({
        title: 'Captain Link Copied',
        titleAr: 'تم نسخ رابط الكباتن بنجاح 🔗',
        message: 'Share this link with captains to register and post trips without fees.',
        messageAr: 'تم نسخ رابط الكباتن المباشر. يقودهم مباشرة للتسجيل والاطلاع على ميزات المنصة (مجاني 100% وبدون عمولات).',
        type: 'general',
        priority: 'low',
        targetTab: 'driver_portal'
      });
    });
  };

  const handleCopyPassengerLink = () => {
    const url = getPassengerInviteUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopiedPassengerLink(true);
      setTimeout(() => setCopiedPassengerLink(false), 3000);
      addNotification({
        title: 'Traveler Link Copied',
        titleAr: 'تم نسخ رابط المسافرين بنجاح 🔗',
        message: 'Share this link with passengers to book trips and track travel securely.',
        messageAr: 'تم نسخ رابط المسافرين المباشر. يقود المسافر مباشرة لتصفح وحجز الرحلات بين المحافظات الـ22.',
        type: 'general',
        priority: 'low',
        targetTab: 'intercity_hub'
      });
    });
  };

  const handleShareCaptainOnWhatsApp = () => {
    const url = getCaptainInviteUrl();
    const text = `🚗 *السلام عليكم كباتن وملاك السيارات في اليمن*
تطبيق «المسافر» (Traveler) يتيح لك الآن تسجيل سيارتك مجاناً وإعلان رحلاتك بين المحافظات وملء مقاعد الراجع بكل سهولة:
✨ تسجيل مجاني 100% بدون أي عمولة أو وسيط.
📱 تواصل مباشر عبر الهاتف والواتساب مع الركاب.
💬 إدارة وفتح الرحلات حتى بدون إنترنت عبر الرسائل النصية SMS.
🛡️ تتبع وأمان عائلي مشفر لكل رحلة.

🔗 *رابط التسجيل وبوابة الكباتن المباشر:*
${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSharePassengerOnWhatsApp = () => {
    const url = getPassengerInviteUrl();
    const text = `🛣️ *منصة المسافر (Traveler) — دليلك وحجزك لرحلات المحافظات اليمنية*
احجز مقعدك بالنفر أو سيارة صالون كاملة VIP بين الـ 22 محافظة يمنية:
✅ حجز مباشر مع الكابتن المعتمد بدون وسيط أو عمولة.
🛡️ كود تتبع عائلي مشفر لمتابعة خط سيرك أولاً بأول.
🚗 تحديثات حية للنقاط الأمنية والعقبات الجبلية.

🔗 *رابط حجز وتصفح الرحلات المباشر:*
${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverWhatsapp, setDriverWhatsapp] = useState('');
  const [operatorType, setOperatorType] = useState<'individual' | 'company'>('individual');
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>(transportOffices[0]?.id || '');
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
  const [vehicleModel, setVehicleModel] = useState('تويوتا لاندكروزر صالون V8');
  const [vehicleYear, setVehicleYear] = useState(2024);
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

  // Office Management State
  const [selectedManagingOffice, setSelectedManagingOffice] = useState<TransportOffice>(transportOffices[0]);
  const [isAddingNewOffice, setIsAddingNewOffice] = useState(false);
  
  // New Office Form State
  const [newOfficeNameAr, setNewOfficeNameAr] = useState('');
  const [newOfficePrimaryGov, setNewOfficePrimaryGov] = useState('عدن');
  const [newOfficeTagline, setNewOfficeTagline] = useState('');
  const [newOfficeAbout, setNewOfficeAbout] = useState('');
  const [newOfficePhone, setNewOfficePhone] = useState('');
  const [newOfficeWhatsapp, setNewOfficeWhatsapp] = useState('');
  const [newOfficeLicense, setNewOfficeLicense] = useState('ترخيص وزارة النقل رقم: YEM-TRANS-2026');

  // New Fleet Vehicle Form State
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [newVehicleModel, setNewVehicleModel] = useState('');
  const [newVehicleYear, setNewVehicleYear] = useState(2024);
  const [newVehiclePlate, setNewVehiclePlate] = useState('');
  const [newVehicleSeats, setNewVehicleSeats] = useState(7);
  const [newVehicleType, setNewVehicleType] = useState<'suv_4x4' | 'vip_limousine' | 'sedan' | 'microbus' | 'large_bus'>('suv_4x4');

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

    const matchedOffice = operatorType === 'company' ? transportOffices.find(o => o.id === selectedOfficeId) : null;
    const finalCompanyName = matchedOffice ? matchedOffice.nameAr : (companyName || undefined);

    const newTripData: InterCityTripListing = {
      id: `intercity-${Date.now()}`,
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
      officeId: matchedOffice?.id,
      companyName: finalCompanyName,
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
      allowsFamilyTracking: false, // 🔒 Exclusive Admin capability
      familyTrackingCode: '', // 🔒 Assigned and activated strictly by Platform Admin
      notes,
      plannedStops: defaultStops
    };

    addIntercityListing(newTripData);
    setSuccessMessage(true);
  };

  const handleCreateNewOffice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficeNameAr.trim() || !newOfficePhone.trim()) return;

    const newOffice: Omit<TransportOffice, 'id'> = {
      nameAr: newOfficeNameAr,
      nameEn: newOfficeNameAr,
      primaryGovernorate: newOfficePrimaryGov,
      logo: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      taglineAr: newOfficeTagline || 'خدمات نقل بري متميزة بين المحافظات اليمنية',
      aboutAr: newOfficeAbout || 'مكتب نقل رائد يقدم رحلات يومية مجدولة ومريحة عبر أحدث أساطيل السيارات والباصات المكيفة.',
      rating: 4.9,
      reviewCount: 1,
      isVerified: true,
      licenseNumber: newOfficeLicense,
      establishedYear: 2024,
      phone: newOfficePhone,
      whatsapp: newOfficeWhatsapp || newOfficePhone,
      email: 'contact@transport-office.ye',
      features: [
        'تكييف مركزي في جميع المركبات',
        'التزام بسيارة بديلة فورية',
        'تتبع حي للأمان العائلي',
        'فحص ميكانيكي معتمد قبل التحرك'
      ],
      fleetVehicles: [
        {
          id: `v-${Date.now()}`,
          model: 'تويوتا لاندكروزر صالون VIP',
          type: 'suv_4x4',
          year: 2024,
          plateNumber: 'نقل معتمد',
          totalSeats: 7,
          amenities: ['تكييف مركزي', 'كراسي جلد', 'واي فاي'],
          photoUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'
        }
      ],
      branches: [
        {
          id: `br-${Date.now()}`,
          governorate: newOfficePrimaryGov,
          city: 'الفرع الرئيسي',
          address: `المكتب الرئيسي — ${newOfficePrimaryGov}`,
          phone: newOfficePhone,
          whatsapp: newOfficeWhatsapp || newOfficePhone,
          workingHours: '24 ساعة / طوال أيام الأسبوع'
        }
      ],
      fleetGallery: [
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
      ]
    };

    addTransportOffice(newOffice);
    setIsAddingNewOffice(false);
    setNewOfficeNameAr('');
    setNewOfficePhone('');
  };

  const handleAddVehicleToCurrentOffice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicleModel.trim() || !selectedManagingOffice) return;

    addFleetVehicleToOffice(selectedManagingOffice.id, {
      model: newVehicleModel,
      type: newVehicleType,
      year: Number(newVehicleYear),
      plateNumber: newVehiclePlate || 'نقل معتمد',
      totalSeats: Number(newVehicleSeats),
      amenities: ['تكييف مركزي عالي الكفاءة', 'كراسي جلد مريحة', 'فحص ميكانيكي مجاز'],
      photoUrl: newVehicleType === 'large_bus' 
        ? 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'
    });

    setShowAddVehicleForm(false);
    setNewVehicleModel('');
    setNewVehiclePlate('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-amber-900/30">
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'بوابة الكباتن ومكاتب النقل اليمنية — منصة المسافر' : 'Driver & Transport Companies Gateway — Traveler'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            {lang === 'ar'
              ? 'تطبيق المسافر يضيف لك ولا يأخذ منك: ملء رحلات الراجع وزيادة دخلك مجاناً'
              : 'Traveler Transit Partners: Monetize Empty Return Trips & Scale Your Fleet'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {lang === 'ar'
              ? 'سواءً كنت كابتن مستقل تمتلك سيارة صالون 4x4 أو صاحب شركة نقل تمتلك أسطول باصات وسيارات، تطبيق المسافر يوفر لك حجوزات مؤكدة وتواصل مباشر مع الركاب بدون عمولات، مع إمكانية فتح الرحلات حتى بدون نت عبر SMS.'
              : 'Register your vehicle, schedule departures, receive direct passenger bookings with 0% commission, and manage trips even offline via SMS.'}
          </p>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="mt-5 relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTabSub('register')}
            className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-600/30 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تسجيل كابتن جديد / فتح رحلة 🚗' : 'Register Captain / Post Trip'}</span>
          </button>

          <button
            onClick={() => setActiveTabSub('why_join')}
            className="px-4 py-2.5 rounded-2xl bg-stone-800/90 hover:bg-stone-700 text-amber-300 text-xs font-bold transition border border-amber-500/30"
          >
            {lang === 'ar' ? 'ميزات المنصة (مجاني 100%) ✨' : 'Platform Benefits (Free)'}
          </button>

          <button
            onClick={() => setActiveTab('intercity_hub')}
            className="px-4 py-2.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs font-bold transition border border-stone-700"
          >
            {lang === 'ar' ? 'عرض الرحلات المفتوحة في المنصة' : 'Browse Live Trips'}
          </button>
        </div>
      </div>

      {/* Dual Official Public Links: Captains & Passengers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Card 1: Captains & Fleet Owners Direct Link */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Car className="w-5 h-5" />
            </div>
            <div className="text-right flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-xs sm:text-sm text-emerald-950 dark:text-emerald-200">
                  {lang === 'ar' ? '1. رابط الكباتن وملاك السيارات المباشر 🔗' : '1. Captains & Vehicle Owners Direct Link'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100">
                  {lang === 'ar' ? 'تسجيل مجاني 0% عمولة' : 'Free Registration'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300/80 mt-1 leading-relaxed">
                {lang === 'ar' 
                  ? 'يقود السائق أو المالك مباشرة إلى واجهة التسجيل المعتمدة وشرح ميزات المنصة، دون أي صلاحيات تعديل غير ما يخص رحلاته فقط.'
                  : 'Directs drivers to registration & benefits with strict access to only their personal trips.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-emerald-200 dark:border-emerald-800/60">
            <div className="hidden sm:block flex-1 truncate text-[11px] font-mono px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-700 text-stone-600 dark:text-stone-300 select-all" dir="ltr">
              {getCaptainInviteUrl()}
            </div>

            <button
              onClick={handleCopyCaptainLink}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 text-xs font-bold border border-emerald-300 dark:border-emerald-700 transition shadow-xs active:scale-95 whitespace-nowrap"
            >
              {copiedCaptainLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              <span>{copiedCaptainLink ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الرابط' : 'Copy')}</span>
            </button>

            <button
              onClick={handleShareCaptainOnWhatsApp}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm active:scale-95 whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'مشاركة واتساب' : 'WhatsApp'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Passengers & Travel Booking Direct Link */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-right flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-200">
                  {lang === 'ar' ? '2. رابط المسافرين وحجز الرحلات المباشر 🔗' : '2. Passenger Booking & Exploration Direct Link'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100">
                  {lang === 'ar' ? 'تصفح وحجز فوري' : 'Live Booking'}
                </span>
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300/80 mt-1 leading-relaxed">
                {lang === 'ar'
                  ? 'يقود المسافر مباشرة إلى تصفح وحجز المقاعد والسيارات بين الـ 22 محافظة، مع تتبع الأمان العائلي وأرقام التواصل المباشرة.'
                  : 'Directs passengers straight to intercity booking across 22 governorates with encrypted family tracking.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-amber-200 dark:border-amber-800/60">
            <div className="hidden sm:block flex-1 truncate text-[11px] font-mono px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-700 text-stone-600 dark:text-stone-300 select-all" dir="ltr">
              {getPassengerInviteUrl()}
            </div>

            <button
              onClick={handleCopyPassengerLink}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-300 dark:border-amber-700 transition shadow-xs active:scale-95 whitespace-nowrap"
            >
              {copiedPassengerLink ? <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> : <Copy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
              <span>{copiedPassengerLink ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الرابط' : 'Copy')}</span>
            </button>

            <button
              onClick={handleSharePassengerOnWhatsApp}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm active:scale-95 whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'مشاركة واتساب' : 'WhatsApp'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTabSub('dashboard')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTabSub === 'dashboard'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>{lang === 'ar' ? '🚗 بوابة الكابتن والمالك' : 'Captain & Owner Hub'}</span>
          {!isProfileComplete && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-bold">
              إكمال التسجيل
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTabSub('garage')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTabSub === 'garage'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Car className="w-4 h-4 text-emerald-500" />
          <span>{lang === 'ar' ? '🚘 كراج المركبات' : 'Garage'}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-700 font-bold">
            {driverVehicles.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTabSub('sms_portal')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTabSub === 'sms_portal'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Radio className="w-4 h-4 text-amber-500" />
          <span>{lang === 'ar' ? '📱 إدارة عبر SMS (بدون نت)' : 'Offline SMS Hub'}</span>
        </button>

        <button
          onClick={() => setActiveTabSub('register')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTabSub === 'register'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'ar' ? 'فتح رحلة مفصلة' : 'Post Detailed Trip'}</span>
        </button>

        <button
          onClick={() => setActiveTabSub('offices_mgmt')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTabSub === 'offices_mgmt'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{lang === 'ar' ? '🏢 مكاتب النقل والأسطول' : 'Office & Fleet Manager'}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/30 text-white font-bold">
            {transportOffices.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTabSub('live_broadcast')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTabSub === 'live_broadcast'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-amber-500/10 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-500/20'
          }`}
        >
          <Radio className="w-4 h-4 animate-pulse text-amber-600" />
          <span>{lang === 'ar' ? '🛰️ بث الموقع وتنبيهات السيول (GPS الهاتف)' : 'Live GPS & Road Alerts'}</span>
          {isCaptainBroadcasting && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTabSub('why_join')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTabSub === 'why_join'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{lang === 'ar' ? 'لماذا تسجل معنا؟ (مضاعفة الدخل)' : 'Benefits for Drivers'}</span>
        </button>

        <button
          onClick={() => setActiveTabSub('verification')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTabSub === 'verification'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{lang === 'ar' ? 'التوثيق ومعايير الأمان' : 'Safety Verification'}</span>
        </button>
      </div>

      {/* SUB-TAB: CAPTAIN & OWNER DASHBOARD / ONBOARDING */}
      {activeTabSub === 'dashboard' && (
        <div>
          {!isProfileComplete ? (
            <CaptainOwnerOnboarding onSuccess={() => setActiveTabSub('dashboard')} />
          ) : (
            <CaptainOwnerDashboard onOpenSMSPortal={() => setActiveTabSub('sms_portal')} />
          )}
        </div>
      )}

      {/* SUB-TAB: GARAGE MANAGER */}
      {activeTabSub === 'garage' && (
        <DriverGarageManager />
      )}

      {/* SUB-TAB: OFFLINE SMS HUB */}
      {activeTabSub === 'sms_portal' && (
        <DriverSMSPortal />
      )}

      {/* SUB-TAB 1: POST NEW TRIP FORM */}
      {activeTabSub === 'register' && (
        <div className="bg-white dark:bg-stone-800 rounded-3xl border border-stone-200 dark:border-stone-700 p-6 shadow-sm space-y-6">
          
          {successMessage ? (
            <div className="p-8 text-center space-y-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl border border-emerald-200 dark:border-emerald-800">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-100">
                {lang === 'ar' ? 'تم نشر رحلتك بنجاح على منصة المسافر!' : 'Trip Successfully Posted!'}
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
                {lang === 'ar'
                  ? 'رحلتك متاحة الآن لآلاف المسافرين في المنصة. سيتمكن الركاب من حجز المقاعد والتواصل معك هاتفياً أو عبر واتساب مباشرة.'
                  : 'Your trip is now live. Passengers can now discover your trip and reach out to you directly!'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('intercity_hub')}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-md"
                >
                  {lang === 'ar' ? 'الانتقال إلى دليل الرحلات المفتوحة' : 'View in Hub'}
                </button>
                <button
                  onClick={() => setSuccessMessage(false)}
                  className="px-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold transition"
                >
                  {lang === 'ar' ? 'إضافة رحلة أخرى' : 'Post Another Trip'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Operator Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  {lang === 'ar' ? 'صفة مقدم الرحلة:' : 'Operator Entity Type:'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOperatorType('individual')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                      operatorType === 'individual'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'كابتن مستقل (صاحب سيارة صالون / باص)' : 'Independent Captain'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOperatorType('company')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                      operatorType === 'company'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'مكتب أو شركة نقل معتمدة' : 'Transport Company'}</span>
                  </button>
                </div>
              </div>

              {/* Office Selection if Company */}
              {operatorType === 'company' && (
                <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/40 space-y-2">
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                    {lang === 'ar' ? 'اختر صفحة المكتب لنشر الرحلة باسمه:' : 'Select Company Profile to Link:'}
                  </label>
                  <select
                    value={selectedOfficeId}
                    onChange={e => setSelectedOfficeId(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                  >
                    {transportOffices.map(off => (
                      <option key={off.id} value={off.id}>
                        {off.nameAr} ({off.primaryGovernorate})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Basic Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'اسم الكابتن / السائق' : 'Driver Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="مثال: الكابتن محمد اليافعي"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'رقم الاتصال المباشر' : 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    placeholder="+967 77X XXX XXX"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'رقم الواتساب للحجز' : 'WhatsApp Number'}
                  </label>
                  <input
                    type="tel"
                    value={driverWhatsapp}
                    onChange={(e) => setDriverWhatsapp(e.target.value)}
                    placeholder="+967 73X XXX XXX"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Route & Timings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'من محافظة (الانطلاق)' : 'From Governorate'}
                  </label>
                  <select
                    value={fromGovernorate}
                    onChange={(e) => setFromGovernorate(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  >
                    {YEMEN_GOVERNORATES.map(gov => (
                      <option key={gov.id} value={gov.nameAr}>{gov.nameAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'مدينة / منطقة الانطلاق' : 'Pickup Area'}
                  </label>
                  <input
                    type="text"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    placeholder="مثال: فرزة الشيخ عثمان"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'إلى محافظة (الوجهة)' : 'To Governorate'}
                  </label>
                  <select
                    value={toGovernorate}
                    onChange={(e) => setToGovernorate(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  >
                    {YEMEN_GOVERNORATES.map(gov => (
                      <option key={gov.id} value={gov.nameAr}>{gov.nameAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'مدينة / منطقة الوصول' : 'Drop-off Area'}
                  </label>
                  <input
                    type="text"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    placeholder="مثال: المكلا / دوعن"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Date, Time, Nature & Vehicle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'تاريخ الانطلاق' : 'Departure Date'}
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
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
                    className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'طبيعة الرحلة' : 'Trip Nature'}
                  </label>
                  <select
                    value={tripNature}
                    onChange={(e) => setTripNature(e.target.value as any)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  >
                    <option value="outbound">رحلة ذهاب مجدولة</option>
                    <option value="return_match">🔥 رحلة راجع شاغرة (خصم وتوفير)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'نوع المركبة' : 'Vehicle Type'}
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as any)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  >
                    <option value="suv_4x4">دفع رباعي 4x4 (صالون / برادو)</option>
                    <option value="large_bus">باص نقل جماعي كبير VIP</option>
                    <option value="microbus">ميكروباص هايس مكيف</option>
                    <option value="vip_limousine">VIP ليموزين فاخر</option>
                  </select>
                </div>
              </div>

              {/* Vehicle Specs & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'موديل ونوع السيارة' : 'Vehicle Model'}
                  </label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="تويوتا لاندكروزر صالون V8"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'سعر المقعد بالنفر (ريال يمني)' : 'Price Per Seat (YER)'}
                  </label>
                  <input
                    type="number"
                    value={pricePerSeat}
                    onChange={(e) => setPricePerSeat(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'سعر السيارة كاملة خاصة (ريال يمني)' : 'Price Full Car (YER)'}
                  </label>
                  <input
                    type="number"
                    value={priceFullCar}
                    onChange={(e) => setPriceFullCar(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200 dark:border-stone-700">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-lg shadow-amber-600/20 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'نشر وتثبيت الرحلة فوراً' : 'Publish Trip'}</span>
                </button>
              </div>

            </form>
          )}

        </div>
      )}

      {/* SUB-TAB 2: OFFICES & FLEET MANAGER */}
      {activeTabSub === 'offices_mgmt' && (
        <div className="space-y-6">
          
          {/* Top Actions for Office Manager */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-stone-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                <span>{lang === 'ar' ? 'لوحة تحكم مكاتب النقل والأسطول' : 'Office & Fleet Showcase Management'}</span>
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'ar' ? 'قم بتخصيص صفحة بروفايل مكتبك، إضافة مركبات الأسطول، الفروع بالمحافظات، وتوليد بوستات تسويقية' : 'Manage your company brand, fleet photos, and branches'}
              </p>
            </div>

            <button
              onClick={() => setIsAddingNewOffice(true)}
              className="px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تسجيل مكتب / شركة نقل جديدة' : 'Register New Office'}</span>
            </button>
          </div>

          {/* New Office Modal / Form */}
          {isAddingNewOffice && (
            <div className="bg-white dark:bg-stone-800 rounded-3xl border border-amber-500/40 p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700">
                <h4 className="text-sm font-black text-stone-900 dark:text-white">
                  {lang === 'ar' ? 'تسجيل صفحة مكتب نقل بري جديد في المسافر' : 'Register New Transport Company'}
                </h4>
                <button 
                  onClick={() => setIsAddingNewOffice(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateNewOffice} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      اسم المكتب / الشركة *
                    </label>
                    <input
                      type="text"
                      required
                      value={newOfficeNameAr}
                      onChange={e => setNewOfficeNameAr(e.target.value)}
                      placeholder="مثال: شركة التلال للنقل الدولي والمحلي"
                      className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      المحافظة الرئيسية (المقر الرئيسي)
                    </label>
                    <select
                      value={newOfficePrimaryGov}
                      onChange={e => setNewOfficePrimaryGov(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                    >
                      {YEMEN_GOVERNORATES.map(gov => (
                        <option key={gov.id} value={gov.nameAr}>{gov.nameAr}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      رقم هاتف الحجز المركزي *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newOfficePhone}
                      onChange={e => setNewOfficePhone(e.target.value)}
                      placeholder="+967 733 XXX XXX"
                      className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      رقم الواتساب
                    </label>
                    <input
                      type="tel"
                      value={newOfficeWhatsapp}
                      onChange={e => setNewOfficeWhatsapp(e.target.value)}
                      placeholder="+967 733 XXX XXX"
                      className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    نبذة تعريفية عن الشركة والخدمات
                  </label>
                  <textarea
                    rows={2}
                    value={newOfficeAbout}
                    onChange={e => setNewOfficeAbout(e.target.value)}
                    placeholder="نبذة عن تأسيس الشركة ومعايير الراحة والأمان..."
                    className="w-full text-xs p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewOffice(false)}
                    className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm"
                  >
                    حفظ وتأكيد تسجيل المكتب
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Offices List Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {transportOffices.map(office => (
              <div
                key={office.id}
                className="bg-white dark:bg-stone-800 rounded-3xl border border-stone-200 dark:border-stone-700 p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={office.logo} 
                      alt={office.nameAr}
                      className="w-14 h-14 rounded-2xl object-cover border border-amber-500 p-0.5"
                    />
                    <div>
                      <h4 className="text-sm font-black text-stone-900 dark:text-white">
                        {office.nameAr}
                      </h4>
                      <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                        المقر: {office.primaryGovernorate} • تأسس {office.establishedYear}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        {office.licenseNumber}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                    معتمد رسمي
                  </span>
                </div>

                <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-100 dark:border-stone-800 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 block">أسطول المركبات</span>
                    <span className="font-bold text-stone-900 dark:text-white">{office.fleetVehicles.length} مركبة</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">فروع المحافظات</span>
                    <span className="font-bold text-stone-900 dark:text-white">{office.branches.length} فروع</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">تقييم المسافرين</span>
                    <span className="font-bold text-amber-500">⭐ {office.rating}</span>
                  </div>
                </div>

                {/* Fleet Quick Preview */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                    مركبات الأسطول الموثقة:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {office.fleetVehicles.map(v => (
                      <span 
                        key={v.id}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium"
                      >
                        🚗 {v.model} ({v.totalSeats} مقاعد)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Office Card Actions */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-700 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setPreviewOffice(office);
                      setIsPreviewOfficeOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>معاينة البروفايل</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedManagingOffice(office);
                        setShowAddVehicleForm(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة سيارة للأسطول</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Vehicle to Office Modal */}
          {showAddVehicleForm && selectedManagingOffice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
              <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-lg w-full p-6 border border-stone-200 dark:border-stone-700 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700">
                  <h4 className="text-sm font-black text-stone-900 dark:text-white">
                    إضافة مركبة إلى أسطول ({selectedManagingOffice.nameAr})
                  </h4>
                  <button onClick={() => setShowAddVehicleForm(false)} className="text-stone-400 text-xs font-bold">✕</button>
                </div>

                <form onSubmit={handleAddVehicleToCurrentOffice} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      نوع وموديل المركبة *
                    </label>
                    <input
                      type="text"
                      required
                      value={newVehicleModel}
                      onChange={e => setNewVehicleModel(e.target.value)}
                      placeholder="مثال: هيونداي ستاريا VIP 2024"
                      className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        سنة الصنع
                      </label>
                      <input
                        type="number"
                        value={newVehicleYear}
                        onChange={e => setNewVehicleYear(Number(e.target.value))}
                        className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        عدد المقاعد
                      </label>
                      <input
                        type="number"
                        value={newVehicleSeats}
                        onChange={e => setNewVehicleSeats(Number(e.target.value))}
                        className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddVehicleForm(false)}
                      className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-700 text-xs font-bold"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm"
                    >
                      إضافة المركبة للأسطول
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SUB-TAB: LIVE BROADCAST & ROAD NOTICES (CAPTAIN PHONE GPS) */}
      {activeTabSub === 'live_broadcast' && (
        <div className="space-y-6">
          
          {/* Main Broadcast Control Card */}
          <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'بث الـ GPS مباشرة من هاتف الكابتن أو المسافر' : 'Mobile GPS Broadcaster'}</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black">
                  {lang === 'ar' ? 'رادار الموقع المباشر وإشعارات الطريق العائلية' : 'Live Road & Geolocation Radar'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLiveModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'معاينة شاشة العائلة 🔒' : 'Preview Family Screen'}</span>
                </button>
              </div>
            </div>

            {/* Trip Code & GPS Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-stone-800/80 p-4 rounded-2xl border border-stone-700/80 space-y-1.5">
                <div className="text-[11px] text-stone-400 font-bold">{lang === 'ar' ? 'كود الرحلة المشفر:' : 'Trip Security Code:'}</div>
                <input
                  type="text"
                  value={captainTripCode}
                  onChange={(e) => setCaptainTripCode(e.target.value)}
                  className="w-full font-mono text-base font-black text-amber-300 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-700 uppercase"
                />
              </div>

              <div className="bg-stone-800/80 p-4 rounded-2xl border border-stone-700/80 space-y-1.5">
                <div className="text-[11px] text-stone-400 font-bold">{lang === 'ar' ? 'الموقع التقريبي الحالي:' : 'Current Approximate Area:'}</div>
                <input
                  type="text"
                  value={captainCityLocation}
                  onChange={(e) => setCaptainCityLocation(e.target.value)}
                  placeholder="مثال: نقيل سمارة — إب"
                  className="w-full text-xs font-semibold text-white bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-700"
                />
              </div>

              <div className="bg-stone-800/80 p-4 rounded-2xl border border-stone-700/80 flex flex-col justify-between">
                <div className="text-[11px] text-stone-400 font-bold">{lang === 'ar' ? 'حالة البث المباشر:' : 'Broadcast Status:'}</div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${isCaptainBroadcasting ? 'bg-emerald-500 animate-ping' : 'bg-stone-600'}`}></span>
                  <span className="text-xs font-bold text-stone-200">
                    {isCaptainBroadcasting 
                      ? (lang === 'ar' ? 'البث قيد العمل (GPS هاتف الكابتن)' : 'Broadcasting Live') 
                      : (lang === 'ar' ? 'البث متوقف' : 'Standby')}
                  </span>
                </div>
              </div>
            </div>

            {/* Broadcast Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={async () => {
                  if (isCaptainBroadcasting) {
                    liveTrackingService.stopBroadcasting(captainTripCode);
                    setIsCaptainBroadcasting(false);
                    addNotification({
                      title: 'Broadcast Stopped',
                      titleAr: 'تم إيقاف بث الموقع',
                      message: 'Live location broadcasting stopped.',
                      messageAr: 'تم إيقاف مشاركة موقعك المباشر مع ركاب الرحلة والأهل.',
                      type: 'safety_alert',
                      priority: 'medium'
                    });
                  } else {
                    const started = await liveTrackingService.startPhoneBroadcasting(
                      captainTripCode,
                      'driver_phone',
                      'الكابتن علي باحاج (تويوتا صالون 2024)',
                      captainCityLocation
                    );
                    if (started) {
                      setIsCaptainBroadcasting(true);
                      addNotification({
                        title: 'Mobile GPS Broadcasting Active',
                        titleAr: 'تم تفعيل بث GPS الهاتف 🛰️',
                        message: `Live coordinates are broadcasting for trip ${captainTripCode}`,
                        messageAr: `يتم الآن تحديث موقع سيارتك تلقائياً لركاب الرحلة ${captainTripCode} وعائلاتهم.`,
                        type: 'safety_alert',
                        priority: 'high'
                      });
                    }
                  }
                }}
                className={`px-5 py-3 rounded-2xl text-xs font-black transition flex items-center gap-2 shadow-lg ${
                  isCaptainBroadcasting
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-stone-950 shadow-emerald-500/20'
                }`}
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>
                  {isCaptainBroadcasting 
                    ? (lang === 'ar' ? 'إيقاف بث موقع السيارة' : 'Stop Live Broadcast') 
                    : (lang === 'ar' ? '🟢 بدء بث موقع السيارة المباشر (GPS هاتفي)' : 'Start Phone GPS Broadcast')}
                </span>
              </button>

              <button
                onClick={() => setIsLiveModalOpen(true)}
                className="px-4 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-md"
              >
                <Navigation className="w-4 h-4" />
                <span>{lang === 'ar' ? 'فتح لوحة متابعة الركاب والأهل' : 'Open Passenger & Family Tracker'}</span>
              </button>
            </div>
          </div>

          {/* Instant Road Notices Publisher Card */}
          <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-700 shadow-sm space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <h4 className="text-base font-black text-stone-900 dark:text-white">
                  {lang === 'ar' ? 'إرسال إشعار فوري بحالة الطريق للركاب والعائلة' : 'Publish Instant Highway Condition Alert'}
                </h4>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                {lang === 'ar' 
                  ? 'في حال واجهت أمطاراً، سيولاً، أعمال صيانة، أو تغيير في الطريق، أرسل إشعاراً بنقرة واحدة لطمأنة الجميع دون تعقيد.'
                  : 'Notify family & passengers about detours, heavy rain/floods, or mountain pass maintenance in one tap.'}
              </p>
            </div>

            {/* Quick Reason Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                {lang === 'ar' ? 'اختر نوع التنبيه:' : 'Alert Category:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'rain_floods' as RoadAlertReason, labelAr: '🌧️ أمطار وسيول', labelEn: 'Rain & Floods' },
                  { id: 'maintenance_detour' as RoadAlertReason, labelAr: '🚧 صيانة أو تحويلة', labelEn: 'Maintenance' },
                  { id: 'fog_low_visibility' as RoadAlertReason, labelAr: '🌫️ ضباب بالعقبة', labelEn: 'Heavy Fog' },
                  { id: 'rest_break' as RoadAlertReason, labelAr: '☕ استراحة وتناول وجبة', labelEn: 'Rest Stop' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCaptainAlertReason(item.id)}
                    className={`p-3 rounded-2xl text-xs font-bold border transition text-center ${
                      captainAlertReason === item.id
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {lang === 'ar' ? item.labelAr : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom note */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                {lang === 'ar' ? 'رسالة توضيحية إضافية للركاب والأهل (اختياري):' : 'Custom Description (Optional):'}
              </label>
              <input
                type="text"
                value={captainAlertText}
                onChange={(e) => setCaptainAlertText(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: سيول في الوادي، توقفنا 20 دقيقة بأمان حتى ينخفض المنسوب.' : 'e.g. Minor flood wait for 20 mins.'}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  liveTrackingService.publishRoadNotice(
                    captainTripCode,
                    captainAlertReason,
                    captainAlertText || (
                      captainAlertReason === 'rain_floods' ? 'أمطار وسيول على الطريق العام مع الالتزام بتحويلة آمنة' :
                      captainAlertReason === 'maintenance_detour' ? 'أعمال صيانة وسفلتة على الطريق مع حركة سير منتظمة' :
                      captainAlertReason === 'fog_low_visibility' ? 'ضباب كثيف في المنعطفات الجبلية مع تهدئة السرعة للأمان' :
                      'توقف لاستراحة قصيرة وتناول وجبة في استراحة معتمدة'
                    )
                  );
                  setAlertSuccessToast(true);
                  setTimeout(() => setAlertSuccessToast(false), 3500);
                  addNotification({
                    title: 'Road Notice Published',
                    titleAr: 'تم نشر تنبيه الطريق للأهل ⚠️',
                    message: `Road alert sent to followers of trip ${captainTripCode}.`,
                    messageAr: `تم إرسال إشعار "${captainAlertReason}" لجميع المتابعين لكود الرحلة ${captainTripCode}.`,
                    type: 'safety_alert',
                    priority: 'high'
                  });
                }}
                className="px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md transition flex items-center gap-2 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إرسال التنبيه فوراً للأهل والركاب' : 'Publish Alert Now'}</span>
              </button>

              {alertSuccessToast && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تم إرسال الإشعار لجميع المتابعين بنجاح!' : 'Alert Sent!'}</span>
                </span>
              )}
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 3: WHY JOIN */}
      {activeTabSub === 'why_join' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 border border-stone-200 dark:border-stone-700 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
              💰
            </div>
            <h4 className="text-sm font-black text-stone-900 dark:text-white">
              القضاء على الرحلات الفارغة (رحلات الراجع)
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              عند توصيلك لركاب من صنعاء إلى عدن أو من عدن إلى المكلا، نظام المسافر يشبك لك حجوزات راجعة على مسار عودتك مباشرة لتضمن دخلاً مضاعفاً في الذهاب والإياب.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 border border-stone-200 dark:border-stone-700 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold">
              🛡️
            </div>
            <h4 className="text-sm font-black text-stone-900 dark:text-white">
              بروتوكول الأمان العائلي المعتمد
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              منح الركاب كود تتبع عائلي يرفع ثقة العائلات في سيارتك، مما يتيح لك استقبال حجوزات خاصة وعائلية متكررة بأعلى الأسعار.
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: VERIFICATION */}
      {activeTabSub === 'verification' && (
        <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 border border-stone-200 dark:border-stone-700 space-y-4">
          <h4 className="text-sm font-black text-stone-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>شروط وضوابط اعتماد الكباتن ومكاتب النقل في تطبيق المسافر</span>
          </h4>
          <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300 list-disc list-inside">
            <li>رخصة قيادة سارية وفحص ميكانيكي دوري للمركبة.</li>
            <li>تكييف مركزي فعال ونظافة تامة للمقصورة والمقاعد.</li>
            <li>الالتزام ببروتوكول سيارة بديلة وتتبع الأمان العائلي.</li>
            <li>الالتزام بمواعيد الانطلاق المحددة ومحطات الاستراحة المعتمدة.</li>
          </ul>
        </div>
      )}

      {/* Company Showcase Modal */}
      <CompanyShowcaseModal
        isOpen={isPreviewOfficeOpen}
        onClose={() => setIsPreviewOfficeOpen(false)}
        office={previewOffice}
      />

      {/* Family Live Tracking & Radar Modal */}
      <FamilyLiveTrackingModal
        isOpen={isLiveModalOpen}
        onClose={() => setIsLiveModalOpen(false)}
        initialCode={captainTripCode}
      />

    </div>
  );
};
