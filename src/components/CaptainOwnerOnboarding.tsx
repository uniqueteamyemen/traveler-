import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  isValidYemeniPhone, 
  getYemeniOperatorName, 
  normalizeYemeniPhone 
} from '../utils/yemenPhoneValidator';
import { DriverVehicle } from '../types/travel';
import { 
  Car, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Sparkles, 
  TrendingUp, 
  Radio, 
  Users, 
  Copy, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface CaptainOwnerOnboardingProps {
  onSuccess?: () => void;
}

export const CaptainOwnerOnboarding: React.FC<CaptainOwnerOnboardingProps> = ({ onSuccess }) => {
  const { completeCaptainProfile, userProfile, addNotification } = useTravel();

  // Role selection
  const [selectedRole, setSelectedRole] = useState<'captain' | 'vehicle_owner'>('captain');

  // Personal & Contact Info
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [governorate, setGovernorate] = useState(userProfile?.governorate || 'عدن');
  const [primaryPhone, setPrimaryPhone] = useState(userProfile?.primaryPhone || userProfile?.phoneNumber || '');
  const [secondaryPhone, setSecondaryPhone] = useState(userProfile?.secondaryPhone || '');
  const [whatsappPhone, setWhatsappPhone] = useState(userProfile?.whatsappPhone || userProfile?.primaryPhone || '');

  // Legal ID Document (Optional - can be added later)
  const [idDocumentType, setIdDocumentType] = useState<'national_id' | 'passport'>(userProfile?.idDocumentType || 'national_id');
  const [idDocumentNumber, setIdDocumentNumber] = useState(userProfile?.idDocumentNumber || '');

  // First Mandatory Vehicle Info
  const [vehicleModel, setVehicleModel] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<DriverVehicle['vehicleType']>('suv_4x4');
  const [totalSeats, setTotalSeats] = useState<number>(7);
  const [year, setYear] = useState<number>(2023);
  const [color, setColor] = useState('أبيض لؤلؤي');

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const yemeniGovernorates = [
    'صنعاء', 'عدن', 'مأرب', 'حضرموت (المكلا / سيئون)', 'تعز', 'إب', 
    'الحديدة', 'شبوة (عتق)', 'ذمار', 'المهرة (الغيضة)', 'عمران', 'لحج', 
    'أبين', 'البيضاء', 'صعدة', 'حجة', 'المحويت', 'ريمة', 'الجوف', 'الضالع', 'سقطرى'
  ];

  const handleCopyPortalLink = () => {
    const portalUrl = `${window.location.origin}${window.location.pathname}#driver`;
    navigator.clipboard.writeText(portalUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
      addNotification({
        title: 'Portal Link Copied',
        titleAr: 'تم نسخ رابط بوابة الكباتن والملاك 🔗',
        message: 'Share this link directly with other drivers and car owners in Yemen.',
        messageAr: 'يمكنك الآن مشاركة هذا الرابط المباشر مع الزملاء الكباتن وملاك السيارات في اليمن.',
        type: 'general',
        priority: 'low',
        targetTab: 'driver_portal'
      });
    });
  };

  const handleUsePrimaryForWhatsapp = () => {
    if (primaryPhone) {
      setWhatsappPhone(primaryPhone);
      setErrors(prev => ({ ...prev, whatsappPhone: '' }));
    }
  };

  const handleUsePrimaryForSecondary = () => {
    if (primaryPhone) {
      setSecondaryPhone(primaryPhone);
      setErrors(prev => ({ ...prev, secondaryPhone: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!displayName.trim()) {
      newErrors.displayName = 'يرجى كتابة اسمك الكامل (أو اسم المالك)';
    }

    if (!primaryPhone.trim()) {
      newErrors.primaryPhone = 'رقم هاتف الاتصال الأول إجباري للتواصل';
    } else if (!isValidYemeniPhone(primaryPhone)) {
      newErrors.primaryPhone = 'رقم هاتف يمني غير صحيح! يجب أن يتكون من 9 أرقام ويبدأ بالرقم 7 (مثل: 777123456)';
    }

    // Secondary phone is optional, but if entered it must be valid
    if (secondaryPhone.trim() && !isValidYemeniPhone(secondaryPhone)) {
      newErrors.secondaryPhone = 'رقم الهاتف الثاني غير صحيح! يجب أن يتكون من 9 أرقام ويبدأ بـ 7';
    }

    if (!whatsappPhone.trim()) {
      newErrors.whatsappPhone = 'رقم الواتساب إجباري لاستقبال رسائل حجز الركاب';
    } else if (!isValidYemeniPhone(whatsappPhone)) {
      newErrors.whatsappPhone = 'رقم واتساب غير صحيح! يجب أن يتكون من 9 أرقام ويبدأ بالرقم 7 (مثل: 733123456)';
    }

    // Mandatory First Vehicle validation
    if (!vehicleModel.trim()) {
      newErrors.vehicleModel = 'يرجى كتابة موديل ونوع سيارتك الأولى (مثال: تويوتا صالون 2024)';
    }

    if (!plateNumber.trim()) {
      newErrors.plateNumber = 'يرجى كتابة رقم لوحة السيارة (مثال: 12455 / صنعاء)';
    }

    if (!totalSeats || totalSeats < 1 || totalSeats > 60) {
      newErrors.totalSeats = 'يرجى إدخال عدد مقاعد الركاب الصحيح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await completeCaptainProfile(
        {
          displayName: displayName.trim(),
          role: selectedRole,
          primaryPhone: normalizeYemeniPhone(primaryPhone),
          secondaryPhone: secondaryPhone.trim() ? normalizeYemeniPhone(secondaryPhone) : undefined,
          whatsappPhone: normalizeYemeniPhone(whatsappPhone),
          governorate,
          idDocumentType,
          idDocumentNumber: idDocumentNumber.trim() || undefined
        },
        {
          model: vehicleModel.trim(),
          plateNumber: plateNumber.trim(),
          vehicleType,
          totalSeats: Number(totalSeats),
          year: Number(year),
          color: color.trim() || 'أبيض',
          isPrimary: true
        }
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Welcome & Link Share Bar */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>بوابة الكباتن ومالكي السيارات الرسمية 🇾🇪</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              انضم إلى أكبر شبكة نقل يمنية بين المحافظات
            </h1>
            <p className="text-emerald-100/80 text-sm mt-1 max-w-xl">
              سجّل بياناتك وسيارتك الأولى خلال دقيقة واحدة، لتصل إلى آلاف المسافرين وتضاعف رحلاتك ودخلك المادي دون وسطاء أو استقطاعات!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={handleCopyPortalLink}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold transition shadow-sm"
              title="رابط مباشر لمشاركته مع الكباتن"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-emerald-200" />}
              <span>{copiedLink ? 'تم نسخ الرابط!' : 'نسخ رابط البوابة للكباتن والملاك'}</span>
            </button>
          </div>
        </div>

        {/* Benefits Grid Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">زيادة الرحلات والدخل</div>
              <div className="text-[11px] text-emerald-200/70">حجوزات يومية مباشرة من الركاب</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-300 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">كود التتبع العائلي</div>
              <div className="text-[11px] text-emerald-200/70">ثقة مطلقة للعائلات للسفر معك</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">إدارة بدون إنترنت عبر SMS</div>
              <div className="text-[11px] text-emerald-200/70">تحديث الرحلات في جميع الخطوط</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Registration Form */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Role Type Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
              1. اختر نوع حسابك في المنصة:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole('captain')}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 text-right transition ${
                  selectedRole === 'captain'
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedRole === 'captain' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  <Car className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">كابتن وسائق سيارة 🚗</span>
                    {selectedRole === 'captain' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    أقود سيارتي بنفسي بين المحافظات اليمنية وأنقل الركاب وأستقبل الحجوزات.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('vehicle_owner')}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 text-right transition ${
                  selectedRole === 'vehicle_owner'
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedRole === 'vehicle_owner' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">مالك سيارة / أسطول مركبات 🏢</span>
                    {selectedRole === 'vehicle_owner' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    أملك مركبة واحدة أو عدة سيارات وأشغّلها عبر كباتن معتمدين لنقل الركاب.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Personal Info & Yemeni Phone Numbers */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                2. البيانات الشخصية وأرقام التواصل (أرقام يمنية فقط 🇾🇪)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="مثال: الكابتن محمد علي العولقي"
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                    errors.displayName ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.displayName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.displayName}
                  </p>
                )}
              </div>

              {/* Governorate */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  محافظة الإقامة / المنطلق الرئيسي
                </label>
                <div className="relative">
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition appearance-none"
                  >
                    {yemeniGovernorates.map((gov) => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Phone 1: Primary Call Phone */}
            <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>هاتف الاتصال الأول (إجباري)</span>
                  <span className="text-red-500">*</span>
                </label>
                {primaryPhone && isValidYemeniPhone(primaryPhone) && (
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium">
                    {getYemeniOperatorName(primaryPhone)}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="tel"
                  dir="ltr"
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  placeholder="777123456"
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                    errors.primaryPhone ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                  +967
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                هاتف الاتصال الصوتي الأساسي الذي سيتصل به الركاب للتأكيد.
              </p>
              {errors.primaryPhone && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.primaryPhone}
                </p>
              )}
            </div>

            {/* Phone 2: Secondary Phone (Optional) & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Secondary Phone (Optional) */}
              <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    هاتف الاتصال الثاني (اختياري)
                  </label>
                  {primaryPhone && (
                    <button
                      type="button"
                      onClick={handleUsePrimaryForSecondary}
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                    >
                      نفس الرقم الأول
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    dir="ltr"
                    value={secondaryPhone}
                    onChange={(e) => setSecondaryPhone(e.target.value)}
                    placeholder="712345678 (اختياري)"
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                      errors.secondaryPhone ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                    +967
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  رقم هاتف بديل للطوارئ، يمكن أن يكون نفس الرقم الأول أو رقماً آخر.
                </p>
                {errors.secondaryPhone && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.secondaryPhone}
                  </p>
                )}
              </div>

              {/* WhatsApp Phone */}
              <div className="bg-emerald-50/40 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>رقم واتساب WhatsApp (إجباري)</span>
                    <span className="text-red-500">*</span>
                  </label>
                  {primaryPhone && (
                    <button
                      type="button"
                      onClick={handleUsePrimaryForWhatsapp}
                      className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      استخدام رقم الاتصال الأول
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    dir="ltr"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="733123456"
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                      errors.whatsappPhone ? 'border-red-500' : 'border-emerald-300 dark:border-emerald-700'
                    }`}
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                    +967
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  رقم الواتساب الفعلي. يمكن أن يكون مطابقاً لرقم الاتصال أو رقماً منفصلاً.
                </p>
                {errors.whatsappPhone && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.whatsappPhone}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Section 3: First Mandatory Vehicle */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  3. بيانات السيارة الأولى (إجباري لإكمال التسجيل 🚗)
                </h2>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                يمكنك إضافة سيارات أخرى لاحقاً
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Vehicle Model */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  نوع وموديل السيارة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="مثال: تويوتا لاندكروزر صالون GXR"
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                    errors.vehicleModel ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.vehicleModel && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.vehicleModel}
                  </p>
                )}
              </div>

              {/* Plate Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  رقم اللوحة والمحافظة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="مثال: 12455 / صنعاء أو عدن 3456"
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                    errors.plateNumber ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.plateNumber && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.plateNumber}
                  </p>
                )}
              </div>

              {/* Vehicle Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  فئة المركبة
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as DriverVehicle['vehicleType'])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                >
                  <option value="suv_4x4">جيب صالون 4x4 دفع رباعي (لاندكروزر / برادو / باترول)</option>
                  <option value="vip_limousine">ليموزين VIP فخم (ستاريا / فان فخم)</option>
                  <option value="microbus">باص صغير ميكروباص (هايس / فوكسي)</option>
                  <option value="sedan">سيدان عائلي (كامري / سوناتا / أوريون)</option>
                  <option value="large_bus">باص نقل جماعي كبير</option>
                </select>
              </div>

              {/* Passenger Seats Count */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  عدد مقاعد الركاب المتاحة للحجز <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  المقاعد المخصصة للركاب فقط باستثناء مقعد السائق.
                </p>
              </div>

              {/* Manufacturing Year */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  سنة الصنع
                </label>
                <input
                  type="number"
                  min="1995"
                  max="2026"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  لون السيارة
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="مثال: أبيض لؤلؤي، فضي، أسود..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Section 4: إثبات الهوية والتوثيق القانوني (اختياري الآن - يمكن إضافته لاحقاً) */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-black">
                  4
                </span>
                وثيقة إثبات الهوية القانونية (اختياري للتسجيل الأولي)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                يمكن إضافتها لاحقاً
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 text-xs text-blue-800 dark:text-blue-300 space-y-1 leading-relaxed">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                التسجيل مجاني في التطبيق، والوثيقة معترف بها قانونياً:
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                يقبل التطبيق قانونياً <span className="font-semibold text-slate-900 dark:text-white">البطاقة الشخصية أو جواز السفر</span>. يمكنك بدء العمل فوراً وإضافة رقم وصورة الوثيقة لاحقاً متى ما رغبت في توثيق الحساب بالكامل.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  نوع الوثيقة المعتمدة
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIdDocumentType('national_id')}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold border text-center transition ${
                      idDocumentType === 'national_id'
                        ? 'bg-blue-500 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    البطاقة الشخصية
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdDocumentType('passport')}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold border text-center transition ${
                      idDocumentType === 'passport'
                        ? 'bg-blue-500 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    جواز السفر
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  رقم الوثيقة (اختياري الآن)
                </label>
                <input
                  type="text"
                  value={idDocumentNumber}
                  onChange={(e) => setIdDocumentNumber(e.target.value)}
                  placeholder={idDocumentType === 'passport' ? 'مثال: رقم جواز السفر...' : 'مثال: الرقم الوطني أو رقم البطاقة الشخصية...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Submission Notice & Action */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                بياناتك وأرقام هواتفك محفوظة بأمان كامل وتظهر للركاب فقط عند حجز مقاعد معك.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition active:scale-[0.98] disabled:opacity-50"
            >
              <span>{isSubmitting ? 'جارٍ حفظ البيانات وتفعيل الحساب...' : 'حفظ البيانات وبدء العمل 🚀'}</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
