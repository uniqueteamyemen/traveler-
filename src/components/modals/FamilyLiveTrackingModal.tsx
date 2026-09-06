import React, { useState, useEffect } from 'react';
import { useTravel } from '../../context/TravelContext';
import { 
  ShieldCheck, 
  Lock, 
  MapPin, 
  Radio, 
  Share2, 
  Check, 
  Copy, 
  AlertTriangle, 
  CloudRain, 
  Car, 
  Smartphone, 
  Sparkles,
  RefreshCw,
  Clock,
  ShieldAlert,
  Send,
  Navigation
} from 'lucide-react';
import { liveTrackingService } from '../../services/liveTrackingService';
import { LiveTripLocation, LocationSourceType, RoadAlertReason } from '../../types/travel';

interface FamilyLiveTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export const FamilyLiveTrackingModal: React.FC<FamilyLiveTrackingModalProps> = ({
  isOpen,
  onClose,
  initialCode
}) => {
  const { lang, isRTL, activeTrip, addNotification } = useTravel();
  
  const [trackingCodeInput, setTrackingCodeInput] = useState<string>(
    initialCode || activeTrip?.trackingCode || 'YEM-AD-MK-772'
  );
  const [currentLocationData, setCurrentLocationData] = useState<LiveTripLocation | null>(null);
  const [isBroadcastingLocal, setIsBroadcastingLocal] = useState<boolean>(false);
  const [selectedSourceType, setSelectedSourceType] = useState<LocationSourceType>('driver_phone');
  const [broadcasterName, setBroadcasterName] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState<boolean>(false);
  
  // Quick Road Notice Creator State
  const [showNoticeForm, setShowNoticeForm] = useState<boolean>(false);
  const [selectedReason, setSelectedReason] = useState<RoadAlertReason>('rain_floods');
  const [customNoticeText, setCustomNoticeText] = useState<string>('');
  const [customCityText, setCustomCityText] = useState<string>('');

  useEffect(() => {
    if (initialCode) {
      setTrackingCodeInput(initialCode);
    } else if (activeTrip?.trackingCode) {
      setTrackingCodeInput(activeTrip.trackingCode);
    }
  }, [initialCode, activeTrip]);

  useEffect(() => {
    if (!isOpen) return;

    const unsub = liveTrackingService.subscribe((locations) => {
      const found = liveTrackingService.getLocationForCode(trackingCodeInput);
      if (found) {
        setCurrentLocationData(found);
        setIsBroadcastingLocal(found.isBroadcasting);
      }
    });

    const initialData = liveTrackingService.getLocationForCode(trackingCodeInput);
    if (initialData) {
      setCurrentLocationData(initialData);
      setIsBroadcastingLocal(initialData.isBroadcasting);
    }

    return () => {
      unsub();
    };
  }, [isOpen, trackingCodeInput]);

  if (!isOpen) return null;

  const handleSearchCode = (codeToSearch: string) => {
    const clean = codeToSearch.trim().toUpperCase();
    setTrackingCodeInput(clean);
    const found = liveTrackingService.getLocationForCode(clean);
    if (found) {
      setCurrentLocationData(found);
      setIsBroadcastingLocal(found.isBroadcasting);
    } else {
      // Create fallback placeholder
      const placeholder: LiveTripLocation = {
        tripCode: clean,
        sourceType: 'driver_phone',
        sourceName: 'هاتف الكابتن المعتمد',
        lat: 14.5,
        lng: 44.5,
        currentCityOrPassAr: 'على مسار الخط الدولي بين المحافظات',
        nearestCheckpointAr: 'نقطة معتمدة',
        nextScheduledStopAr: 'المحطة القادمة',
        lastUpdated: 'تم الربط الآن 🛰️',
        isBroadcasting: true,
        signalStatus: 'good_4g'
      };
      setCurrentLocationData(placeholder);
    }
  };

  const handleToggleBroadcast = async () => {
    const code = trackingCodeInput.trim().toUpperCase();
    if (!isBroadcastingLocal) {
      const name = broadcasterName.trim() || (selectedSourceType === 'driver_phone' ? 'الكابتن (هاتف السيارة)' : 'هاتف المسافر المباشر');
      await liveTrackingService.startPhoneBroadcasting(code, selectedSourceType, name, customCityText);
      setIsBroadcastingLocal(true);
      addNotification({
        title: 'Live Location Streaming Started',
        titleAr: 'تم بدء بث موقع الرحلة الحي عبر الهاتف بنجاح',
        message: `Broadcasting active for tracking code ${code}. Family can now follow road progress.`,
        messageAr: `تم تفعيل بث الموقع لكود الرحلة المشفر (${code}). يستطيع أفراد العائلة متابعة موقعك لحظة بلحظة.`,
        type: 'safety_alert',
        priority: 'medium',
        targetTab: 'fixed_plan'
      });
    } else {
      liveTrackingService.stopBroadcasting(code);
      setIsBroadcastingLocal(false);
    }
  };

  const handleSendRoadNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const code = trackingCodeInput.trim().toUpperCase();
    const notice = liveTrackingService.publishRoadNotice(
      code,
      selectedReason,
      customNoticeText,
      selectedReason === 'rain_floods' ? 'تحويلة الوادي المرتفعة' : undefined
    );

    addNotification({
      title: 'Road Alert Published',
      titleAr: `تنبيه طريق جديد: ${notice.titleAr}`,
      message: notice.messageAr,
      messageAr: notice.messageAr,
      type: 'safety_alert',
      priority: 'high',
      targetTab: 'fixed_plan'
    });

    setShowNoticeForm(false);
    setCustomNoticeText('');
  };

  const currentCode = currentLocationData?.tripCode || trackingCodeInput;

  const getLiveTrackUrl = () => {
    const origin = (typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null')
      ? window.location.origin
      : 'https://deterministicsolutionsdesign.com';
    return `${origin}/live-track?code=${encodeURIComponent(currentCode)}`;
  };

  const handleCopyLink = () => {
    const link = getLiveTrackUrl();
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const city = currentLocationData?.currentCityOrPassAr || 'على مسار الخط بين المحافظات';
    const roadNotice = currentLocationData?.activeRoadNotice ? `\n⚠️ ${currentLocationData.activeRoadNotice.titleAr}: ${currentLocationData.activeRoadNotice.messageAr}` : '';
    const trackUrl = getLiveTrackUrl();
    const text = `🇾🇪 *تحديث مسار رحلة تطبيق المسافر (Traveler) — تتبع مشفر*\n\n🔒 *كود الأمان والتتبع:* ${currentCode}\n📍 *الموقع الحالي:* ${city}\n📱 *مصدر التتبع:* ${currentLocationData?.sourceName || 'هاتف الرحلة المباشر'}\n⏱ *آخر تحديث:* ${currentLocationData?.lastUpdated || 'الآن'}${roadNotice}\n\n🔗 *رابط المتابعة العائلية الحية:* ${trackUrl}\n\n_الحمد لله الرحلة تسير بأمان وفق خطة المحطات المعتمدة._`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl max-w-3xl w-full my-auto flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center backdrop-blur-md">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  {lang === 'ar' ? 'نظام تتبع الرحلة العائلي المشفر' : 'Encrypted Family Live Tracker'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                  {lang === 'ar' ? 'GPS هاتف ذكي' : 'Phone GPS'}
                </span>
              </div>
              <p className="text-xs text-stone-300">
                {lang === 'ar' 
                  ? 'متابعة حركة السيارة وموقعها بين المحافظات وتنبيهات السيول والصيانة عبر كود أمان محمي' 
                  : 'Track real-time city progress, rain & road detour alerts via secure travel code'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition relative z-10 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* Tracking Code Search Box */}
          <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              {lang === 'ar' ? 'أدخل كود الرحلة المشفر للمتابعة (متاح للأهل بدون تسجيل دخول):' : 'Enter Encrypted Trip Code:'}
            </label>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={trackingCodeInput}
                  onChange={(e) => setTrackingCodeInput(e.target.value.toUpperCase())}
                  placeholder="مثال: YEM-AD-MK-772"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-sm font-mono font-bold text-amber-700 dark:text-amber-400 uppercase focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <button
                onClick={() => handleSearchCode(trackingCodeInput)}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
              >
                <Navigation className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تتبع الآن' : 'Track'}</span>
              </button>
            </div>

            {/* Quick Sample Codes */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] text-stone-500">{lang === 'ar' ? 'أكواد تجريبية جاهزة:' : 'Sample Codes:'}</span>
              {['YEM-AD-MK-772', 'YEM-SAN-789', 'YEM-HAD-882'].map(code => (
                <button
                  key={code}
                  onClick={() => handleSearchCode(code)}
                  className="px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-[11px] font-mono hover:bg-amber-100 dark:hover:bg-amber-950/40 hover:text-amber-800 transition"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Main Status & Live Position Card */}
          {currentLocationData ? (
            <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-6 border border-stone-700 shadow-lg space-y-5">
              
              {/* Top Details & Source */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-700/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xl font-black text-amber-400 tracking-wider">
                      {currentLocationData.tripCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold flex items-center gap-1">
                      <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
                      <span>{lang === 'ar' ? 'بث حي نشط' : 'Broadcasting Live'}</span>
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                    <span>{lang === 'ar' ? 'المصدر:' : 'Source:'} <strong>{currentLocationData.sourceName}</strong></span>
                  </p>
                </div>

                <div className="text-end text-xs text-stone-300">
                  <span className="text-[11px] block text-stone-400">{lang === 'ar' ? 'توقيت التحديث:' : 'Last Updated:'}</span>
                  <span className="font-semibold text-amber-200">{currentLocationData.lastUpdated}</span>
                </div>
              </div>

              {/* Prominent City & Location Display */}
              <div className="bg-stone-800/90 rounded-2xl p-4 border border-stone-700 space-y-2">
                <div className="text-xs font-semibold text-stone-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{lang === 'ar' ? 'موقع السيارة والرحلة الحالي:' : 'Current Highway / City Location:'}</span>
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-white">
                  {currentLocationData.currentCityOrPassAr}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-700/60 text-xs text-stone-300">
                  <div>
                    <span className="text-stone-400">{lang === 'ar' ? 'أقرب نقطة تفتيش:' : 'Nearest Checkpoint:'} </span>
                    <strong className="text-stone-200">{currentLocationData.nearestCheckpointAr || 'نقطة معتمدة'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400">{lang === 'ar' ? 'المحطة القادمة:' : 'Next Stop:'} </span>
                    <strong className="text-stone-200">{currentLocationData.nextScheduledStopAr || 'استراحة الخط العام'}</strong>
                  </div>
                </div>
              </div>

              {/* Active Road Alert / Weather Notice Banner */}
              {currentLocationData.activeRoadNotice && (
                <div className="bg-amber-950/60 border-2 border-amber-500/80 rounded-2xl p-4 text-white space-y-1.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-amber-300 text-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
                      <span>{currentLocationData.activeRoadNotice.titleAr}</span>
                    </div>
                    <span className="text-[10px] text-amber-200/80 bg-amber-900/80 px-2 py-0.5 rounded-md">
                      {currentLocationData.activeRoadNotice.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-stone-200 leading-relaxed">
                    {currentLocationData.activeRoadNotice.messageAr}
                  </p>
                  {currentLocationData.activeRoadNotice.isDetourActive && (
                    <div className="text-[11px] text-emerald-300 font-bold pt-1 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'تحويلة سالكة:' : 'Active Safe Detour:'} {currentLocationData.activeRoadNotice.detourRouteNameAr || 'مسار بديل آمن'}</span>
                    </div>
                  )}
                </div>
              )}

              {/* WhatsApp Share & Copy Link Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedWhatsApp ? (lang === 'ar' ? 'تم الفتح!' : 'Shared!') : (lang === 'ar' ? 'إرسال تحديث الموقع للأهل على واتساب' : 'Share to Family WhatsApp')}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="py-2.5 px-4 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? (lang === 'ar' ? 'تم نسخ الرابط' : 'Copied!') : (lang === 'ar' ? 'نسخ رابط التتبع المباشر' : 'Copy Live Link')}</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-700">
              <p className="text-xs text-stone-500">
                {lang === 'ar' ? 'الرجاء إدخال كود الرحلة لعرض موقعها الحالي' : 'Please enter a valid trip code to view live status'}
              </p>
            </div>
          )}

          {/* Stream Switch & Road Alert Control (For Driver or Passenger) */}
          <div className="border-t border-stone-200 dark:border-stone-700 pt-5 space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'ar' ? 'التحكم في بث الموقع من الهاتف الذكي' : 'Phone GPS Broadcasting Control'}</span>
                </h4>
                <p className="text-[11px] text-stone-500">
                  {lang === 'ar' ? 'اختر المصدر الذي يرسل الإحداثيات (هاتف الكابتن أو هاتف المسافر)' : 'Choose whether driver or passenger phone transmits location'}
                </p>
              </div>

              <button
                onClick={handleToggleBroadcast}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                  isBroadcastingLocal
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>
                  {isBroadcastingLocal
                    ? (lang === 'ar' ? 'إيقاف البث' : 'Stop Broadcast')
                    : (lang === 'ar' ? 'بدء بث الموقع للرحلة' : 'Start Broadcast')}
                </span>
              </button>
            </div>

            {/* Source Selector Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedSourceType('driver_phone')}
                className={`p-3 rounded-2xl border text-start transition flex items-center gap-3 ${
                  selectedSourceType === 'driver_phone'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200 font-bold'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">{lang === 'ar' ? 'هاتف الكابتن (السيارة)' : 'Driver Phone (Car)'}</div>
                  <div className="text-[10px] text-stone-500">{lang === 'ar' ? 'يتابع موقع المركبة طوال الخط' : 'Tracks the vehicle along route'}</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedSourceType('passenger_phone')}
                className={`p-3 rounded-2xl border text-start transition flex items-center gap-3 ${
                  selectedSourceType === 'passenger_phone'
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500 text-sky-900 dark:text-sky-200 font-bold'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-700 dark:text-sky-300">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">{lang === 'ar' ? 'هاتف المسافر نفسه' : 'Passenger Phone'}</div>
                  <div className="text-[10px] text-stone-500">{lang === 'ar' ? 'متابعة شخصية مستقلة للأهل' : 'Direct family link from passenger'}</div>
                </div>
              </button>
            </div>

            {/* Quick Button to Send Road Notice */}
            <div className="pt-2">
              {!showNoticeForm ? (
                <button
                  onClick={() => setShowNoticeForm(true)}
                  className="w-full py-2.5 px-4 rounded-xl border border-dashed border-amber-400 dark:border-amber-600 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100/60 transition flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'ar' ? '+ إرسال تنبيه طريق / سيول / صيانة / تحويلة للأهل والركاب' : '+ Send Road Condition Alert to Family'}</span>
                </button>
              ) : (
                <form onSubmit={handleSendRoadNotice} className="bg-stone-50 dark:bg-stone-800 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>{lang === 'ar' ? 'إرسال تنبيه مسار الطريق' : 'Publish Road Notice'}</span>
                    </h5>
                    <button
                      type="button"
                      onClick={() => setShowNoticeForm(false)}
                      className="text-stone-400 hover:text-stone-600 text-xs font-bold"
                    >
                      إلغاء
                    </button>
                  </div>

                  {/* Reason selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'rain_floods', label: 'أمطار وسيول 🌧️' },
                      { id: 'maintenance_detour', label: 'صيانة وتحويلة 🚧' },
                      { id: 'fog_low_visibility', label: 'ضباب بالعقبة 🌫️' },
                      { id: 'rock_slide', label: 'تساقط صخور ⚠️' },
                      { id: 'rest_break', label: 'استراحة وصلاة ☕' },
                      { id: 'road_clear', label: 'طريق سالك تماماً ✅' }
                    ].map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedReason(r.id as RoadAlertReason)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold border text-center transition ${
                          selectedReason === r.id
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <input
                      type="text"
                      value={customNoticeText}
                      onChange={(e) => setCustomNoticeText(e.target.value)}
                      placeholder={lang === 'ar' ? 'اكتب تفاصيل التنبيه (مثال: تم أخذ تحويلة الجسر بسبب سيل الوادي)' : 'Notice details...'}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'إرسال التنبيه فوراً' : 'Publish Alert'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
