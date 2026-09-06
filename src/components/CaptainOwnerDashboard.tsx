import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  DriverVehicle, 
  InterCityTripListing, 
  TripLifecycleStatus 
} from '../types/travel';
import { 
  formatYemeniPhone, 
  getYemeniWhatsAppLink, 
  isValidYemeniPhone, 
  normalizeYemeniPhone,
  getYemeniOperatorName 
} from '../utils/yemenPhoneValidator';
import { 
  Car, 
  Plus, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Radio, 
  Copy, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Check,
  AlertTriangle,
  Send,
  Navigation,
  KeyRound,
  Lock,
  X
} from 'lucide-react';

interface CaptainOwnerDashboardProps {
  onOpenSMSPortal?: () => void;
}

export const CaptainOwnerDashboard: React.FC<CaptainOwnerDashboardProps> = ({ onOpenSMSPortal }) => {
  const { 
    userProfile, 
    currentUser,
    driverVehicles, 
    addDriverVehicle, 
    removeDriverVehicle, 
    intercityListings, 
    addIntercityListing,
    updateTripLifecycleStatus,
    updateContactPhones,
    addNotification 
  } = useTravel();

  // Modals
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [showEditPhonesModal, setShowEditPhonesModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Vehicle form state
  const [newVehicleModel, setNewVehicleModel] = useState('');
  const [newPlateNumber, setNewPlateNumber] = useState('');
  const [newVehicleType, setNewVehicleType] = useState<DriverVehicle['vehicleType']>('suv_4x4');
  const [newTotalSeats, setNewTotalSeats] = useState<number>(7);
  const [newYear, setNewYear] = useState<number>(2024);
  const [newColor, setNewColor] = useState('أبيض');
  const [vehicleError, setVehicleError] = useState('');

  // Edit Phone Numbers form state
  const [editPrimaryPhone, setEditPrimaryPhone] = useState(userProfile?.primaryPhone || userProfile?.phoneNumber || '');
  const [editSecondaryPhone, setEditSecondaryPhone] = useState(userProfile?.secondaryPhone || '');
  const [editWhatsappPhone, setEditWhatsappPhone] = useState(userProfile?.whatsappPhone || userProfile?.primaryPhone || '');
  const [phoneErrors, setPhoneErrors] = useState<{ [key: string]: string }>({});

  // New Trip Listing form state
  const [fromGov, setFromGov] = useState(userProfile?.governorate || 'عدن');
  const [toGov, setToGov] = useState('صنعاء');
  const [selectedVehicleId, setSelectedVehicleId] = useState(driverVehicles[0]?.id || '');
  const [tripDate, setTripDate] = useState(new Date().toISOString().split('T')[0]);
  const [tripTime, setTripTime] = useState('06:30 ص');
  const [pricePerSeat, setPricePerSeat] = useState<number>(18000);
  const [priceFullCar, setPriceFullCar] = useState<number>(90000);
  const [tripNotes, setTripNotes] = useState('');
  const [tripError, setTripError] = useState('');

  const yemeniGovernorates = [
    'صنعاء', 'عدن', 'مأرب', 'حضرموت (المكلا / سيئون)', 'تعز', 'إب', 
    'الحديدة', 'شبوة (عتق)', 'ذمار', 'المهرة (الغيضة)', 'عمران', 'لحج', 
    'أبين', 'البيضاء', 'صعدة', 'حجة', 'المحويت', 'ريمة', 'الجوف', 'الضالع', 'سقطرى'
  ];

  // Filter listings belonging to this captain
  const myUid = currentUser?.uid || userProfile?.uid;
  const myPrimaryPhone = userProfile?.primaryPhone || userProfile?.phoneNumber;
  
  const myListings = intercityListings.filter(l => {
    if (myUid && (l.driverUid === myUid || l.ownerUid === myUid)) return true;
    if (myPrimaryPhone && (normalizeYemeniPhone(l.driverPhone) === normalizeYemeniPhone(myPrimaryPhone))) return true;
    // Also match if user's display name matches
    if (userProfile?.displayName && l.driverName === userProfile.displayName) return true;
    return false;
  });

  const handleCopyPortalLink = () => {
    const portalUrl = `${window.location.origin}${window.location.pathname}#driver`;
    navigator.clipboard.writeText(portalUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    });
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicleModel.trim() || !newPlateNumber.trim()) {
      setVehicleError('يرجى تعبئة موديل السيارة ورقم اللوحة');
      return;
    }

    addDriverVehicle({
      model: newVehicleModel.trim(),
      plateNumber: newPlateNumber.trim(),
      vehicleType: newVehicleType,
      totalSeats: Number(newTotalSeats),
      year: Number(newYear),
      color: newColor.trim(),
      ownerId: myUid
    });

    setNewVehicleModel('');
    setNewPlateNumber('');
    setVehicleError('');
    setShowAddVehicleModal(false);
  };

  const handleSavePhones = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!editPrimaryPhone.trim()) {
      errors.primary = 'رقم هاتف الاتصال الأول إجباري';
    } else if (!isValidYemeniPhone(editPrimaryPhone)) {
      errors.primary = 'رقم هاتف يمني غير صحيح (9 أرقام تبدأ بـ 7)';
    }

    if (editSecondaryPhone.trim() && !isValidYemeniPhone(editSecondaryPhone)) {
      errors.secondary = 'رقم هاتف يمني غير صحيح (9 أرقام تبدأ بـ 7)';
    }

    if (!editWhatsappPhone.trim()) {
      errors.whatsapp = 'رقم الواتساب إجباري';
    } else if (!isValidYemeniPhone(editWhatsappPhone)) {
      errors.whatsapp = 'رقم واتساب يمني غير صحيح (9 أرقام تبدأ بـ 7)';
    }

    if (Object.keys(errors).length > 0) {
      setPhoneErrors(errors);
      return;
    }

    await updateContactPhones(
      normalizeYemeniPhone(editPrimaryPhone),
      editSecondaryPhone.trim() ? normalizeYemeniPhone(editSecondaryPhone) : '',
      normalizeYemeniPhone(editWhatsappPhone)
    );

    setShowEditPhonesModal(false);
    setPhoneErrors({});
  };

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromGov === toGov) {
      setTripError('محافظة الانطلاق والوصول يجب أن تكونا مختلفتين');
      return;
    }

    const vehicle = driverVehicles.find(v => v.id === selectedVehicleId) || driverVehicles[0];
    if (!vehicle) {
      setTripError('يرجى إضافة سيارة أولاً قبل إعلان الرحلة');
      return;
    }

    addIntercityListing({
      driverName: userProfile?.displayName || 'كابتن معتمد',
      driverPhone: userProfile?.primaryPhone || userProfile?.phoneNumber || '777000000',
      driverWhatsapp: userProfile?.whatsappPhone || userProfile?.primaryPhone || '777000000',
      driverPhoto: userProfile?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      driverRating: 4.9,
      totalTripsCompleted: (userProfile?.totalTrips || 0) + 1,
      isVerifiedDriver: true,
      hasMechanicalPass: true,
      hasBackupCarCommitment: true,
      driverUid: myUid,
      ownerUid: myUid,
      vehicleId: vehicle.id,
      fromGovernorate: fromGov,
      fromCity: fromGov,
      toGovernorate: toGov,
      toCity: toGov,
      departureDate: tripDate,
      departureTime: tripTime,
      vehicleModel: vehicle.model,
      vehiclePlateNumber: vehicle.plateNumber,
      vehicleType: vehicle.vehicleType,
      totalSeats: vehicle.totalSeats,
      availableSeats: vehicle.totalSeats,
      pricePerSeat: Number(pricePerSeat),
      priceFullCar: Number(priceFullCar),
      currency: 'YER',
      luggageCapacityBags: 6,
      airConditioned: true,
      allowsFamilyTracking: false, // 🔒 Exclusive Admin capability
      familyTrackingCode: '', // 🔒 Assigned exclusively by Platform Admin
      notes: tripNotes || 'رحلة مريحة مع التزام بمحطات الاستراحة المعتمدة وتكييف ممتاز',
      operatorType: 'individual',
      tripStatus: 'open',
      tripNature: 'outbound',
      estimatedDurationHours: 6,
      vehicleYear: vehicle.year || 2023,
      vehiclePhoto: vehicle.photoUrl || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
      plannedStops: []
    });

    setTripError('');
    setShowAddTripModal(false);
  };

  const whatsappUrl = getYemeniWhatsAppLink(
    userProfile?.whatsappPhone || userProfile?.primaryPhone || '',
    'السلام عليكم كابتن، بخصوص رحلتك عبر تطبيق المسافر (Traveler)...'
  );

  return (
    <div className="space-y-6">
      
      {/* 1. Header Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 text-white shadow-md border border-slate-700/60">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={userProfile?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={userProfile?.displayName || 'Captain'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400/80 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <Check className="w-3 h-3 text-white stroke-[3]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold">
                  {userProfile?.displayName || 'كابتن المسافر المعتمد'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {userProfile?.role === 'vehicle_owner' ? 'مالك مركبة 🏢' : 'كابتن معتمد 🚗'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  ID: {userProfile?.uid?.substring(0, 8) || 'CAP-YE'}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-2 text-xs text-slate-300 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {userProfile?.governorate || 'عدن'}
                </span>
                <span className="flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-teal-400" />
                  {driverVehicles.length} {driverVehicles.length === 1 ? 'سيارة مسجلة' : 'سيارات مسجلة'}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  {myListings.length} رحلات معلنة
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => setShowAddTripModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>إعلان رحلة جديدة</span>
            </button>

            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold border border-slate-700 transition"
            >
              <Car className="w-4 h-4 text-emerald-400" />
              <span>+ إضافة سيارة</span>
            </button>

            <button
              onClick={handleCopyPortalLink}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold border border-slate-700 transition"
              title="نسخ رابط البوابة المخصص لمشاركته مع الكباتن"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
              <span>{copiedLink ? 'تم نسخ الرابط!' : 'مشاركة الرابط'}</span>
            </button>

            {onOpenSMSPortal && (
              <button
                onClick={onOpenSMSPortal}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
                title="إدارة الرحلات عبر الرسائل النصية بدون إنترنت"
              >
                <Radio className="w-4 h-4" />
                <span>إدارة عبر SMS</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 2. Contact Information Cards with WhatsApp Direct Click */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              بياناتي الأساسية للتواصل (أرقام يمنية معتمدة 🇾🇪)
            </h2>
          </div>
          <button
            onClick={() => {
              setEditPrimaryPhone(userProfile?.primaryPhone || userProfile?.phoneNumber || '');
              setEditSecondaryPhone(userProfile?.secondaryPhone || '');
              setEditWhatsappPhone(userProfile?.whatsappPhone || userProfile?.primaryPhone || '');
              setShowEditPhonesModal(true);
            }}
            className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>تعديل الأرقام</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Primary Call Phone */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>هاتف الاتصال الأول (اتصال)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="font-mono font-bold text-sm text-slate-900 dark:text-white" dir="ltr">
              {formatYemeniPhone(userProfile?.primaryPhone || userProfile?.phoneNumber || '777000000')}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              {getYemeniOperatorName(userProfile?.primaryPhone || userProfile?.phoneNumber || '')}
            </div>
          </div>

          {/* Secondary Phone (Optional) */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>هاتف الاتصال الثاني (احتياطي)</span>
              <span className="text-[10px] text-slate-400">اختياري</span>
            </div>
            <div className="font-mono font-bold text-sm text-slate-900 dark:text-white" dir="ltr">
              {userProfile?.secondaryPhone 
                ? formatYemeniPhone(userProfile.secondaryPhone)
                : 'غير مضاف'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {userProfile?.secondaryPhone ? getYemeniOperatorName(userProfile.secondaryPhone) : 'للطوارئ فقط'}
            </div>
          </div>

          {/* WhatsApp Phone with Pulse Direct Button */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 mb-1 font-semibold">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  رقم الواتساب (WhatsApp)
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="font-mono font-bold text-sm text-emerald-950 dark:text-emerald-100" dir="ltr">
                {formatYemeniPhone(userProfile?.whatsappPhone || userProfile?.primaryPhone || '777000000')}
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>فتح محادثة واتساب المباشرة</span>
            </a>
          </div>

        </div>
      </div>

      {/* 3. My Vehicles (كراج سياراتي) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              سياراتي وكراج المركبات ({driverVehicles.length})
            </h2>
          </div>
          <button
            onClick={() => setShowAddVehicleModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة سيارة أخرى</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {driverVehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className="relative p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/30 hover:border-emerald-300 dark:hover:border-emerald-700 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      #{index + 1}
                    </span>
                    {index === 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 font-bold">
                        السيارة الأساسية
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {vehicle.model}
                  </h3>
                </div>

                {driverVehicles.length > 1 && (
                  <button
                    onClick={() => removeDriverVehicle(vehicle.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                    title="حذف السيارة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span>رقم اللوحة:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{vehicle.plateNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>سعة المقاعد:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{vehicle.totalSeats} مقاعد ركاب</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>سنة الصنع:</span>
                  <span>{vehicle.year}</span>
                </div>
                {vehicle.color && (
                  <div className="flex items-center justify-between">
                    <span>اللون:</span>
                    <span>{vehicle.color}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">جاهزة لفتح الرحلات</span>
                <button
                  onClick={() => {
                    setSelectedVehicleId(vehicle.id);
                    setShowAddTripModal(true);
                  }}
                  className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                >
                  فتح رحلة بهذه السيارة ←
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. My Trips (رحلاتي المعلنة بين المحافظات) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              رحلاتي المعلنة بين المحافظات ({myListings.length})
            </h2>
          </div>
          <button
            onClick={() => setShowAddTripModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إعلان رحلة جديدة</span>
          </button>
        </div>

        {myListings.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
            <Navigation className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              لا توجد لديك رحلات معلنة حالياً
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              أعلن عن خط سير رحلتك القادمة الآن ليتمكن الركاب في المحافظات من رؤيتها وحجز مقاعدهم مباشرة!
            </p>
            <button
              onClick={() => setShowAddTripModal(true)}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إعلان رحلتك الأولى الآن</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myListings.map((listing) => {
              const status = listing.tripStatus || 'open';
              return (
                <div
                  key={listing.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-900/30 hover:border-slate-300 transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Route & Vehicle */}
                    <div>
                      <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                        <span>{listing.fromGovernorate}</span>
                        <span className="text-emerald-500 font-bold">←</span>
                        <span>{listing.toGovernorate}</span>
                        <span className="text-xs font-normal text-slate-500">({listing.vehicleModel})</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {listing.departureDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {listing.departureTime}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                          {listing.pricePerSeat?.toLocaleString()} ريال/راكب
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          المتاح: {listing.availableSeats} من {listing.totalSeats} مقاعد
                        </span>
                      </div>

                      {/* Family Tracking Code (Restricted to Admin Control) */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[11px] text-slate-500 font-medium">كود التتبع والأمان:</span>
                        {listing.allowsFamilyTracking && listing.familyTrackingCode ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-mono font-bold">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>{listing.familyTrackingCode}</span>
                            <span className="text-[9px] bg-emerald-200 dark:bg-emerald-800 px-1.5 py-0.5 rounded text-emerald-900 dark:text-emerald-100 font-sans font-normal">
                              مفعّل من إدارة المسافر
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-500 text-[11px]">
                            <Lock className="w-3 h-3 text-amber-500" />
                            <span>صلاحية حصرية للمسؤول والإدارة فقط</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Management */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 self-center">
                        حالة الرحلة:
                      </div>
                      <div className="inline-flex rounded-xl p-1 bg-slate-200 dark:bg-slate-700 text-xs">
                        <button
                          onClick={() => updateTripLifecycleStatus(listing.id, 'open')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition ${
                            status === 'open' 
                              ? 'bg-emerald-600 text-white shadow-sm' 
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                          }`}
                        >
                          مفتوحة
                        </button>
                        <button
                          onClick={() => updateTripLifecycleStatus(listing.id, 'full')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition ${
                            status === 'full' 
                              ? 'bg-amber-600 text-white shadow-sm' 
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                          }`}
                        >
                          اكتمل الركاب
                        </button>
                        <button
                          onClick={() => updateTripLifecycleStatus(listing.id, 'departed')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition ${
                            status === 'departed' 
                              ? 'bg-blue-600 text-white shadow-sm' 
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                          }`}
                        >
                          انطلقت 🚀
                        </button>
                        <button
                          onClick={() => updateTripLifecycleStatus(listing.id, 'arrived')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition ${
                            status === 'arrived' 
                              ? 'bg-slate-800 text-white shadow-sm' 
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                          }`}
                        >
                          وصلت 🏁
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Discover Traveler Showcase (عرض ميزات التطبيق للكابتن والمالك) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-700 shadow-md">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>اكتشف ميزات منصة Traveler — صُممت خصيصاً لزيادة رحلاتك ودخلك</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          لماذا يفضّل الركاب والعائلات اليمنية السفر معك عبر Traveler؟
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed mb-6">
          نوفر لك حزمة متكاملة من الأدوات التقنية التي تسهّل تواصلك المباشر مع المسافرين وتمنحهم أعلى درجات الموثوقية لحجز مقاعد سيارتك بالكامل.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">تغطية الـ 22 محافظة يمنية</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              وصول مباشر للمسافرين في صنعاء، عدن، مأرب، حضرموت، تعز، شبوة، والمهرة بدون سماسرة أو عمولات مجحفة.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition">
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">كود التتبع العائلي المشفر</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              يحصل أهالي الركاب على كود تتبع مباشر لمتابعة خط السير والاستراحات، مما يجعلهم يفضلون السفر معك على غيرك.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center mb-3">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">إدارة الرحلات بدون إنترنت (SMS)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              انقطعت التغطية في الطريق؟ يمكنك إرسال رسائل نصية قصيرة SMS لتحديث حالة المقاعد وإشعار الركاب بالانطلاق فوراً.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition">
            <div className="w-9 h-9 rounded-lg bg-red-500/20 text-red-300 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">رادار العقبات وطرق السفر</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              تنبيهات حية مستمرة عن نقيل سمارة، هيجة العبد، مناخة، وخط العبر لتفادي القطوعات وضمان سلامة الجميع.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition">
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">حجز بالنفر أو سيارة كاملة VIP</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              مرونة كاملة لتعبئة مقاعد سيارتك أو تأجيرها بالكامل لمشاوير العائلات ورجال الأعمال بأعلى عائد ربحي.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition">
            <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center mb-3">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">أمان وصلاحيات مشددة</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              بياناتك وسياراتك ورحلاتك ملكك بالكامل، ولا يمكن لأي سائق آخر التعديل عليها أو انتحال بياناتك.
            </p>
          </div>

        </div>
      </div>

      {/* MODAL 1: Add New Vehicle */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setShowAddVehicleModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Car className="w-5 h-5 text-emerald-600" />
              <span>إضافة سيارة جديدة إلى كراجك 🚗</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              يمكنك إضافة عدة سيارات واستخدام أي منها عند إعلان رحلاتك.
            </p>

            <form onSubmit={handleSaveVehicle} className="space-y-4">
              {vehicleError && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{vehicleError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  نوع وموديل السيارة *
                </label>
                <input
                  type="text"
                  value={newVehicleModel}
                  onChange={(e) => setNewVehicleModel(e.target.value)}
                  placeholder="مثال: تويوتا هايلوكس دبل أو ستاريا VIP"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    رقم اللوحة *
                  </label>
                  <input
                    type="text"
                    value={newPlateNumber}
                    onChange={(e) => setNewPlateNumber(e.target.value)}
                    placeholder="مثال: 56788 / عدن"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    فئة المركبة
                  </label>
                  <select
                    value={newVehicleType}
                    onChange={(e) => setNewVehicleType(e.target.value as DriverVehicle['vehicleType'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="suv_4x4">جيب صالون 4x4</option>
                    <option value="vip_limousine">ليموزين VIP</option>
                    <option value="microbus">باص صغير ميكروباص</option>
                    <option value="sedan">سيدان</option>
                    <option value="large_bus">باص كبير</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    المقاعد
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={newTotalSeats}
                    onChange={(e) => setNewTotalSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    سنة الصنع
                  </label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    اللون
                  </label>
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="أبيض"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                >
                  حفظ السيارة في الكراج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Phone Numbers */}
      {showEditPhonesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setShowEditPhonesModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-600" />
              <span>تحديث أرقام التواصل (أرقام يمنية فقط)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              يمكنك استخدام نفس الرقم للاتصال والواتساب أو استخدام أرقام منفصلة.
            </p>

            <form onSubmit={handleSavePhones} className="space-y-4">
              {/* Primary Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  هاتف الاتصال الأول *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    dir="ltr"
                    value={editPrimaryPhone}
                    onChange={(e) => setEditPrimaryPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-mono">+967</span>
                </div>
                {phoneErrors.primary && <p className="text-red-500 text-xs mt-1">{phoneErrors.primary}</p>}
              </div>

              {/* Secondary Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  هاتف الاتصال الثاني (اختياري)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    dir="ltr"
                    value={editSecondaryPhone}
                    onChange={(e) => setEditSecondaryPhone(e.target.value)}
                    placeholder="اختياري"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-mono">+967</span>
                </div>
                {phoneErrors.secondary && <p className="text-red-500 text-xs mt-1">{phoneErrors.secondary}</p>}
              </div>

              {/* WhatsApp Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  رقم الواتساب (WhatsApp) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    dir="ltr"
                    value={editWhatsappPhone}
                    onChange={(e) => setEditWhatsappPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-mono">+967</span>
                </div>
                {phoneErrors.whatsapp && <p className="text-red-500 text-xs mt-1">{phoneErrors.whatsapp}</p>}
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditPhonesModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                >
                  حفظ الأرقام
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add New Intercity Trip */}
      {showAddTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddTripModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-600" />
              <span>إعلان رحلة جديدة بين المحافظات 🚗</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              ستظهر هذه الرحلة فوراً للمسافرين لحجز مقاعدهم والتواصل معك عبر الاتصال أو الواتساب.
            </p>

            <form onSubmit={handleCreateTrip} className="space-y-4">
              {tripError && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{tripError}</span>
                </div>
              )}

              {/* Route */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    من محافظة *
                  </label>
                  <select
                    value={fromGov}
                    onChange={(e) => setFromGov(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white"
                  >
                    {yemeniGovernorates.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    إلى محافظة *
                  </label>
                  <select
                    value={toGov}
                    onChange={(e) => setToGov(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white"
                  >
                    {yemeniGovernorates.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              {/* Select Vehicle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  اختر السيارة من كراجك *
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white"
                >
                  {driverVehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.model} ({v.plateNumber}) - {v.totalSeats} مقاعد
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    تاريخ الرحلة *
                  </label>
                  <input
                    type="date"
                    value={tripDate}
                    onChange={(e) => setTripDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    وقت الانطلاق *
                  </label>
                  <input
                    type="text"
                    value={tripTime}
                    onChange={(e) => setTripTime(e.target.value)}
                    placeholder="06:30 ص"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    سعر المقعد بالنفر (ريال يمني) *
                  </label>
                  <input
                    type="number"
                    value={pricePerSeat}
                    onChange={(e) => setPricePerSeat(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    سعر السيارة كاملة VIP (ريال يمني)
                  </label>
                  <input
                    type="number"
                    value={priceFullCar}
                    onChange={(e) => setPriceFullCar(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ملاحظات الرحلة والتكييف
                </label>
                <input
                  type="text"
                  value={tripNotes}
                  onChange={(e) => setTripNotes(e.target.value)}
                  placeholder="مثال: مكيفة بالكامل، شنط حتى 25 كجم للراكب، استراحة في طريق شبوة..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTripModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                >
                  نشر الرحلة للمسافرين 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
