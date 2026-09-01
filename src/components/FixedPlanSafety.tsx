import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Utensils, 
  Compass, 
  Share2, 
  Copy, 
  Phone, 
  Car, 
  AlertTriangle, 
  Lock, 
  Check, 
  FileCheck2, 
  Sparkles,
  Fuel,
  Coffee,
  Plus
} from 'lucide-react';
import { PlannedStop } from '../types/travel';

export const FixedPlanSafety: React.FC = () => {
  const { activeTrip, lang, approveTripPlan, togglePlannedStopComplete, addPlannedStop } = useTravel();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedSMS, setCopiedSMS] = useState(false);
  const [showAddStopModal, setShowAddStopModal] = useState(false);

  // New Stop State
  const [newStopNameAr, setNewStopNameAr] = useState('');
  const [newStopType, setNewStopType] = useState<PlannedStop['type']>('rest_food');
  const [newStopTime, setNewStopTime] = useState('12:00');
  const [newStopDuration, setNewStopDuration] = useState(30);
  const [newStopLocation, setNewStopLocation] = useState('');

  if (!activeTrip) {
    return (
      <div className="p-8 text-center bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
        <p className="text-xs text-stone-600 dark:text-stone-300">
          {lang === 'ar' ? 'الرجاء اختيار رحلة لعرض خطة السير الثابتة' : 'Please select a trip to view its Fixed Plan'}
        </p>
      </div>
    );
  }

  const trackingCode = activeTrip.trackingCode || `YEM-TRACK-${activeTrip.id.substring(0, 5).toUpperCase()}`;
  const stops = activeTrip.plannedStops || [];
  const completedStopsCount = stops.filter(s => s.isCompleted).length;

  const handleCopyTrackingLink = () => {
    const link = `https://traveler-yemen.app/track?code=${trackingCode}&trip=${encodeURIComponent(activeTrip.titleAr || activeTrip.title)}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopySMSUpdate = () => {
    const msg = `تحديث رحلة سَفَر اليمنية 🇾🇪: أنا في طريقي من (${activeTrip.origin || activeTrip.originGovernorate || 'عدن'}) إلى (${activeTrip.destination || activeTrip.destinationGovernorate || 'حضرموت'}). السائق: ${activeTrip.assignedDriver?.name || 'كابتن معتمد'}. رقم التتبع: ${trackingCode}. الحمد لله كل شيء تمام والرحلة تسير وفق خطة المحطات المعتمدة.`;
    navigator.clipboard.writeText(msg);
    setCopiedSMS(true);
    setTimeout(() => setCopiedSMS(false), 2500);
  };

  const handleCreateStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStopNameAr.trim() || !newStopLocation.trim()) return;

    addPlannedStop(activeTrip.id, {
      nameAr: newStopNameAr,
      nameEn: newStopNameAr,
      type: newStopType,
      estimatedTime: newStopTime,
      durationMinutes: Number(newStopDuration),
      locationName: newStopLocation,
      isCompleted: false
    });

    setNewStopNameAr('');
    setNewStopLocation('');
    setShowAddStopModal(false);
  };

  const getStopTypeIcon = (type: PlannedStop['type']) => {
    switch (type) {
      case 'rest_food':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'prayer':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'fuel':
        return <Fuel className="w-4 h-4 text-blue-600" />;
      case 'checkpoint':
        return <ShieldCheck className="w-4 h-4 text-rose-600" />;
      case 'scenic':
        return <Compass className="w-4 h-4 text-purple-600" />;
      default:
        return <Coffee className="w-4 h-4 text-amber-600" />;
    }
  };

  const getStopTypeName = (type: PlannedStop['type']) => {
    switch (type) {
      case 'rest_food':
        return lang === 'ar' ? 'استراحة طعام وضيافة' : 'Food & Rest';
      case 'prayer':
        return lang === 'ar' ? 'استراحة صلاة ودورات مياه' : 'Prayer & Restroom';
      case 'fuel':
        return lang === 'ar' ? 'محطة وقود وفحص إطارات' : 'Fuel & Tires';
      case 'checkpoint':
        return lang === 'ar' ? 'نقطة تفتيش معتمدة' : 'Security Checkpoint';
      case 'scenic':
        return lang === 'ar' ? 'مطل بانورامي وتصوير' : 'Scenic Viewpoint';
      default:
        return lang === 'ar' ? 'استراحة' : 'Rest Stop';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-stone-800 rounded-2xl p-6 border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white">
                {lang === 'ar' ? 'خطة الرحلة الثابتة وأمان العائلة' : 'Fixed Plan Journey & Family Safety'}
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                {lang === 'ar' 
                  ? 'محطات مسبقة محددة بدقة، اتفاقية سيارة بديلة، ورابط تتبع حي لطمأنة عائلتك' 
                  : 'Predefined stops, backup car warranty, and real-time family peace-of-mind link'}
              </p>
            </div>
          </div>
        </div>

        {/* Plan Approval Status */}
        <div className="flex items-center gap-3">
          {activeTrip.isPlanApproved ? (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ar' ? 'تمت موافقة المسافر على الخطة' : 'Passenger Approved'}</span>
            </div>
          ) : (
            <button
              onClick={() => approveTripPlan(activeTrip.id)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'الموافقة على خطة السير والشروط' : 'Approve Journey Plan'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Grid: Family Tracking Hub + Fixed Stops Itinerary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 1 Column: Family Safety & Tracking Card + Driver Warranty */}
        <div className="space-y-5">
          
          {/* Family Peace of Mind Tracking Hub */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-2xl p-5 border border-stone-700 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                {lang === 'ar' ? 'نظام تتبع العائلة المشفر' : 'Family Live Tracker'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {lang === 'ar' ? 'متصل وحي' : 'Active'}
              </span>
            </div>

            <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700 space-y-2 text-xs">
              <div className="text-stone-300 text-[11px]">
                {lang === 'ar' ? 'رمز تتبع مسار الرحلة (شارك الرمز مع الأهل):' : 'Family Access Tracking Code:'}
              </div>
              <div className="font-mono text-base font-black text-amber-300 tracking-wider flex items-center justify-between">
                <span>{trackingCode}</span>
                <button
                  onClick={handleCopyTrackingLink}
                  className="p-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-white text-xs transition"
                  title="نسخ الرابط"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-stone-300 leading-relaxed">
              {lang === 'ar'
                ? 'يمكن لأفراد عائلتك فتح رابط التتبع لمعرفة مكان السيارة، والسائق المعتمد، والمحطة التالية في الوقت الفعلي.'
                : 'Your family can open the live link to track current road progress, verified driver ID, and next stops in real-time.'}
            </p>

            <div className="pt-2 border-t border-stone-700/60 flex flex-col gap-2">
              <button
                onClick={handleCopyTrackingLink}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedCode ? (lang === 'ar' ? 'تم نسخ الرابط!' : 'Link Copied!') : (lang === 'ar' ? 'نسخ رابط التتبع للعائلة' : 'Copy Family Live Link')}</span>
              </button>

              <button
                onClick={handleCopySMSUpdate}
                className="w-full py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>{copiedSMS ? (lang === 'ar' ? 'تم نسخ رسالة التحديث!' : 'SMS Copied!') : (lang === 'ar' ? 'رسالة SMS سريعة للمناطق الضعيفة' : 'Copy Weak-Signal SMS Update')}</span>
              </button>
            </div>
          </div>

          {/* Backup Vehicle Commitment & Mechanical Check Card */}
          <div className="bg-white dark:bg-stone-800 rounded-2xl p-5 border border-stone-200 dark:border-stone-700 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-stone-900 dark:text-white">
                {lang === 'ar' ? 'ضمان السيارة البديلة والفحص الفني' : 'Backup Vehicle Warranty'}
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === 'ar' ? 'التزام سيارة بديلة:' : 'Backup Car Guarantee:'}</strong>{' '}
                  {lang === 'ar'
                    ? 'في حال حدوث أي عطل ميكانيكي أثناء الطريق، يلتزم الناقل بتوفير مركبة بديلة معتمدة فوراً لمتابعة الرحلة دون تأخير.'
                    : 'Driver commits to provide a verified replacement vehicle in case of mechanical breakdown.'}
                </span>
              </div>

              <div className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === 'ar' ? 'الفحص المسبق للمركبة:' : 'Vehicle Pre-Check:'}</strong>{' '}
                  {lang === 'ar'
                    ? 'فحص شامل للإطارات، الفرامل، التكييف، ومياه التبريد لملاءمة الطرق الجبلية والصحراوية.'
                    : 'Tires, brakes, engine cooling, and AC checked prior to mountain & desert highways.'}
                </span>
              </div>
            </div>

            {/* Assigned Driver Card */}
            {activeTrip.assignedDriver && (
              <div className="mt-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs space-y-1">
                <div className="font-bold text-stone-900 dark:text-white flex items-center justify-between">
                  <span>{activeTrip.assignedDriver.name}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">✓ سائق معتمد</span>
                </div>
                <div className="text-[11px] text-stone-600 dark:text-stone-300">
                  {activeTrip.assignedDriver.vehicleModel} • {activeTrip.assignedDriver.plateNumber}
                </div>
                <div className="text-[11px] text-stone-700 dark:text-stone-300 pt-1 font-mono">
                  {activeTrip.assignedDriver.phone}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right 2 Columns: Scheduled Fixed Stops Along Route */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-white dark:bg-stone-800 rounded-2xl p-5 border border-stone-200 dark:border-stone-700 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                  {lang === 'ar' ? 'المحطات المجدولة على خط الرحلة (خطة السير)' : 'Fixed Stops along the Route'}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  {lang === 'ar'
                    ? `تم إنجاز ${completedStopsCount} من أصل ${stops.length} محطات محددة مسبقاً`
                    : `${completedStopsCount} of ${stops.length} predefined stops reached`}
                </p>
              </div>

              <button
                onClick={() => setShowAddStopModal(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إضافة محطة' : 'Add Stop'}</span>
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-stone-100 dark:bg-stone-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stops.length > 0 ? (completedStopsCount / stops.length) * 100 : 0}%` }}
              />
            </div>

            {/* Stops Timeline List */}
            <div className="space-y-3 pt-2">
              {stops.map((stop, index) => {
                return (
                  <div
                    key={stop.id}
                    className={`p-4 rounded-xl border transition flex items-start justify-between gap-3 ${
                      stop.isCompleted
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                        : 'bg-stone-50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => togglePlannedStopComplete(activeTrip.id, stop.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition ${
                          stop.isCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-transparent hover:border-amber-500'
                        }`}
                        title={lang === 'ar' ? 'تحديد كمكتمل' : 'Mark as Reached'}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                            {getStopTypeIcon(stop.type)}
                          </span>
                          <h4 className={`text-xs font-bold ${stop.isCompleted ? 'line-through text-stone-500' : 'text-stone-900 dark:text-white'}`}>
                            {lang === 'ar' ? stop.nameAr : (stop.nameEn || stop.nameAr)}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium">
                            {getStopTypeName(stop.type)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-stone-600 dark:text-stone-300">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            {stop.locationName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-400" />
                            {stop.estimatedTime} ({stop.durationMinutes} {lang === 'ar' ? 'دقيقة' : 'mins'})
                          </span>
                        </div>

                        {stop.notes && (
                          <p className="text-[11px] text-stone-600 dark:text-stone-400 pt-0.5 italic">
                            {stop.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-end shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        stop.isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      }`}>
                        {stop.isCompleted ? (lang === 'ar' ? 'تم التوقف' : 'Reached') : (lang === 'ar' ? 'قادمة' : 'Pending')}
                      </span>
                    </div>

                  </div>
                );
              })}

              {stops.length === 0 && (
                <div className="p-6 text-center text-xs text-stone-500 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl">
                  {lang === 'ar' ? 'لم تتم إضافة محطات بعد لهذه الرحلة. اضغط على "+ إضافة محطة".' : 'No stops added yet.'}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Add Stop Modal */}
      {showAddStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-800 rounded-2xl max-w-md w-full p-6 border border-stone-200 dark:border-stone-700 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                {lang === 'ar' ? 'إضافة محطة استراحة / نقطة فحص' : 'Add Planned Route Stop'}
              </h3>
              <button onClick={() => setShowAddStopModal(false)} className="text-stone-400 text-xs font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateStop} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'ar' ? 'اسم المحطة أو الاستراحة' : 'Stop Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={newStopNameAr}
                  onChange={(e) => setNewStopNameAr(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: استراحة شقرة الساحلية' : 'e.g. Shuqra Rest Stop'}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'ar' ? 'نوع المحطة' : 'Stop Type'}
                </label>
                <select
                  value={newStopType}
                  onChange={(e) => setNewStopType(e.target.value as any)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                >
                  <option value="rest_food">{lang === 'ar' ? 'استراحة طعام وضيافة' : 'Food & Rest'}</option>
                  <option value="prayer">{lang === 'ar' ? 'استراحة صلاة ودورات مياه' : 'Prayer & Restroom'}</option>
                  <option value="fuel">{lang === 'ar' ? 'محطة تزود بالوقود وفحص' : 'Fuel & Check'}</option>
                  <option value="checkpoint">{lang === 'ar' ? 'نقطة تفتيش أمنية معتمدة' : 'Security Checkpoint'}</option>
                  <option value="scenic">{lang === 'ar' ? 'مطل بانورامي وسياحي' : 'Scenic Viewpoint'}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'الوقت التقديري' : 'Estimated Time'}
                  </label>
                  <input
                    type="time"
                    value={newStopTime}
                    onChange={(e) => setNewStopTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'مدة التوقف (بالدقائق)' : 'Duration (mins)'}
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={newStopDuration}
                    onChange={(e) => setNewStopDuration(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'ar' ? 'الموقع الجغرافي / المنطقة' : 'Location / Landmark'} *
                </label>
                <input
                  type="text"
                  required
                  value={newStopLocation}
                  onChange={(e) => setNewStopLocation(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: محافظة أبين — خط الساحل' : 'e.g. Abyan Coast'}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStopModal(false)}
                  className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                >
                  {lang === 'ar' ? 'حفظ المحطة' : 'Save Stop'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
