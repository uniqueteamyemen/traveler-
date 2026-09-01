import React from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  FileText, 
  Luggage, 
  BookOpen,
  DollarSign,
  ShieldCheck,
  Car,
  ArrowRightLeft,
  Share2
} from 'lucide-react';
import { UpcomingEventBanner } from './UpcomingEventBanner';

interface TripOverviewProps {
  onOpenNewActivity: () => void;
  onOpenNewExpense: () => void;
  onOpenNewStory: () => void;
}

export const TripOverview: React.FC<TripOverviewProps> = ({
  onOpenNewActivity,
  onOpenNewExpense,
  onOpenNewStory
}) => {
  const { activeTrip, lang, setActiveTab } = useTravel();

  if (!activeTrip) {
    return (
      <div className="text-center py-16 text-stone-500">
        {lang === 'ar' ? 'لم يتم تحديد أي رحلة بعد' : 'No active trip selected'}
      </div>
    );
  }

  // Calculate statistics
  const totalActivities = (activeTrip.days || []).reduce((acc, day) => acc + (day.activities?.length || 0), 0);
  const completedActivities = (activeTrip.days || []).reduce(
    (acc, day) => acc + (day.activities?.filter(a => a.isCompleted)?.length || 0), 
    0
  );
  const activityProgress = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  const totalSpent = (activeTrip.expenses || []).reduce((acc, exp) => acc + exp.amount, 0);
  const budgetRatio = activeTrip.budget > 0 ? Math.min(Math.round((totalSpent / activeTrip.budget) * 100), 100) : 0;

  const totalPacking = (activeTrip.packingList || []).length;
  const packedCount = (activeTrip.packingList || []).filter(p => p.isPacked).length;
  const packingProgress = totalPacking > 0 ? Math.round((packedCount / totalPacking) * 100) : 0;

  const totalStops = (activeTrip.plannedStops || []).length;
  const completedStops = (activeTrip.plannedStops || []).filter(s => s.isCompleted).length;

  const startDate = new Date(activeTrip.startDate);
  const endDate = new Date(activeTrip.endDate);
  const durationDays = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-stone-200/80 dark:border-stone-800 bg-stone-900 text-white min-h-[220px] sm:min-h-[260px] flex flex-col justify-end p-6 sm:p-8">
        <img
          src={activeTrip.coverImage}
          alt={activeTrip.title}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35 hover:scale-105 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent" />

        <div className="relative z-10 space-y-2.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {activeTrip.originGovernorate && activeTrip.destinationGovernorate ? (
              <span className="px-3 py-1 rounded-full bg-amber-600 text-white flex items-center gap-1.5 shadow-sm font-bold">
                <Car className="w-3.5 h-3.5" />
                {activeTrip.originGovernorate} ➔ {activeTrip.destinationGovernorate}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-stone-950 flex items-center gap-1.5 shadow-xs">
                <MapPin className="w-3.5 h-3.5" />
                {activeTrip.destination}
              </span>
            )}

            <span className="px-2.5 py-1 rounded-full bg-stone-800/80 backdrop-blur-sm text-stone-200 border border-stone-700/50 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {activeTrip.startDate} → {activeTrip.endDate} ({durationDays} {lang === 'ar' ? 'أيام' : 'days'})
            </span>

            {activeTrip.trackingCode && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'رمز الأمان:' : 'Code:'} {activeTrip.trackingCode}</span>
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {lang === 'ar' ? (activeTrip.titleAr || activeTrip.title) : activeTrip.title}
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 leading-relaxed">
            {activeTrip.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-stone-300">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ar' ? 'المسافرون:' : 'Travelers:'} {activeTrip.travelers?.join(', ')}</span>
            </div>
            {activeTrip.assignedDriver && (
              <div className="flex items-center gap-1.5 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'السائق المعتمد:' : 'Driver:'} {activeTrip.assignedDriver.name} ({activeTrip.assignedDriver.vehicleModel})</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-Time Event & Departure Countdown Alert Banner */}
      <UpcomingEventBanner />

      {/* Quick Action Transit Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setActiveTab('intercity_hub')}
          className="p-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between shadow-xs hover:opacity-95 transition"
        >
          <div className="text-start">
            <div className="text-xs font-bold">{lang === 'ar' ? 'سوق رحلات المحافظات' : 'Intercity Hub'}</div>
            <div className="text-[11px] text-amber-100">{lang === 'ar' ? 'حجز مقاعد وسيارات خاصة بين الـ 22 محافظة' : 'Book seats & cars across 22 governorates'}</div>
          </div>
          <Car className="w-6 h-6 shrink-0 opacity-80" />
        </button>

        <button
          onClick={() => setActiveTab('fixed_plan')}
          className="p-4 rounded-xl bg-stone-900 text-white flex items-center justify-between shadow-xs hover:bg-stone-800 transition border border-stone-800"
        >
          <div className="text-start">
            <div className="text-xs font-bold text-amber-400">{lang === 'ar' ? 'خطة السير وتتبع العائلة' : 'Fixed Plan & Live Track'}</div>
            <div className="text-[11px] text-stone-300">{lang === 'ar' ? `${totalStops} محطات محددة • ضمان سيارة بديلة` : `${totalStops} stops • Backup car guarantee`}</div>
          </div>
          <ShieldCheck className="w-6 h-6 shrink-0 text-emerald-400" />
        </button>

        <button
          onClick={() => setActiveTab('driver_portal')}
          className="p-4 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white flex items-center justify-between shadow-xs hover:bg-stone-50 dark:hover:bg-stone-700/50 transition"
        >
          <div className="text-start">
            <div className="text-xs font-bold text-amber-700 dark:text-amber-400">{lang === 'ar' ? 'بوابة السائقين والشركات' : 'Driver & Fleet Portal'}</div>
            <div className="text-[11px] text-stone-600 dark:text-stone-300">{lang === 'ar' ? 'نشر رحلات الراجع وزيادة الدخل مجاناً' : 'Fill empty return seats free'}</div>
          </div>
          <ArrowRightLeft className="w-6 h-6 shrink-0 text-amber-600" />
        </button>
      </div>

      {/* Metric Quick Glance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Fixed stops progress */}
        <div 
          onClick={() => setActiveTab('fixed_plan')}
          className="cursor-pointer bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 transition group shadow-2xs"
        >
          <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300 font-medium">
            <span>{lang === 'ar' ? 'محطات خطة السير' : 'Route Stops Done'}</span>
            <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-500 group-hover:scale-110 transition" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
              {completedStops}/{totalStops}
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {totalStops > 0 ? Math.round((completedStops / totalStops) * 100) : 0}%
            </span>
          </div>
          <div className="mt-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-600 h-full rounded-full transition-all duration-500" style={{ width: `${totalStops > 0 ? (completedStops / totalStops) * 100 : 0}%` }} />
          </div>
        </div>

        {/* Budget Spent */}
        <div 
          onClick={() => setActiveTab('expenses')}
          className="cursor-pointer bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 transition group shadow-2xs"
        >
          <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300 font-medium">
            <span>{lang === 'ar' ? 'المصاريف والميزانية' : 'Budget Spent'}</span>
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-500 group-hover:scale-110 transition" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
              {totalSpent.toLocaleString()} {activeTrip.currency}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-stone-600 dark:text-stone-300">
            {lang === 'ar' ? 'من ميزانية' : 'of'} {activeTrip.budget.toLocaleString()} {activeTrip.currency} ({budgetRatio}%)
          </div>
          <div className="mt-1.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                budgetRatio > 90 ? 'bg-rose-500' : 'bg-emerald-600 dark:bg-emerald-500'
              }`} 
              style={{ width: `${budgetRatio}%` }} 
            />
          </div>
        </div>

        {/* Packing list */}
        <div 
          onClick={() => setActiveTab('packing')}
          className="cursor-pointer bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 transition group shadow-2xs"
        >
          <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300 font-medium">
            <span>{lang === 'ar' ? 'حقيبة السفر' : 'Packing Progress'}</span>
            <Luggage className="w-4 h-4 text-sky-600 dark:text-sky-500 group-hover:scale-110 transition" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
              {packedCount}/{totalPacking}
            </span>
            <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
              {packingProgress}%
            </span>
          </div>
          <div className="mt-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-sky-600 h-full rounded-full transition-all duration-500" style={{ width: `${packingProgress}%` }} />
          </div>
        </div>

        {/* Stories / Beginning of Story */}
        <div 
          onClick={() => setActiveTab('stories')}
          className="cursor-pointer bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 transition group shadow-2xs"
        >
          <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300 font-medium">
            <span>{lang === 'ar' ? 'بداية القصة والذكريات' : 'Beginning of Story'}</span>
            <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-500 group-hover:scale-110 transition" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
              {(activeTrip.stories || []).length}
            </span>
            <span className="text-xs text-stone-600 dark:text-stone-300">
              {lang === 'ar' ? 'قصص موثقة' : 'entries'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-purple-700 dark:text-purple-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{lang === 'ar' ? 'وثّق يوميات الرحلة' : 'Capture memories'}</span>
          </div>
        </div>

      </div>

      {/* Main Content Grid: Next Activity & Key Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Next activity highlight card */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
                  {lang === 'ar' ? 'النشاط القادم في الجدول' : 'Upcoming Next Activity'}
                </h3>
              </div>
              <button 
                onClick={() => setActiveTab('itinerary')}
                className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span>{lang === 'ar' ? 'عرض الجدول كاملاً' : 'Full Itinerary'}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>

            {totalActivities > 0 ? (
              <div className="mt-4 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    {activeTrip.days?.[0]?.activities?.[0]?.time || '08:00 صباحاً'}
                  </span>
                  <span className="text-xs text-stone-600 dark:text-stone-300">
                    {lang === 'ar' ? activeTrip.days?.[0]?.titleAr : activeTrip.days?.[0]?.title}
                  </span>
                </div>
                <h4 className="text-base font-bold text-stone-900 dark:text-white">
                  {lang === 'ar' 
                    ? (activeTrip.days?.[0]?.activities?.[0]?.titleAr || activeTrip.days?.[0]?.activities?.[0]?.title) 
                    : activeTrip.days?.[0]?.activities?.[0]?.title}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {activeTrip.days?.[0]?.activities?.[0]?.description}
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{activeTrip.days?.[0]?.activities?.[0]?.location}</span>
                </div>
              </div>
            ) : (
              <div className="mt-8 text-center py-6 text-stone-600 dark:text-stone-300 text-xs">
                {lang === 'ar' ? '🎉 تم إنجاز جميع الأنشطة المجدولة أو لم تتم إضافة أنشطة بعد!' : '🎉 All planned activities completed or no items added!'}
              </div>
            )}
          </div>

          {/* Action quick buttons */}
          <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={onOpenNewActivity}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:bg-stone-200 dark:hover:bg-stone-700 transition"
            >
              <Plus className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'ar' ? 'إضافة نشاط' : 'Add Activity'}</span>
            </button>

            <button
              onClick={onOpenNewExpense}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:bg-stone-200 dark:hover:bg-stone-700 transition"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'ar' ? 'تسجيل مصروف' : 'Log Expense'}</span>
            </button>

            <button
              onClick={onOpenNewStory}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:bg-stone-200 dark:hover:bg-stone-700 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>{lang === 'ar' ? 'كتابة قصة / ذكرى' : 'Add Story Note'}</span>
            </button>
          </div>
        </div>

        {/* Side Panel: Documents & Key Reservations */}
        <div className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>{lang === 'ar' ? 'الوثائق والحجوزات الهامة' : 'Key Documents & Passes'}</span>
            </h3>
            <button 
              onClick={() => setActiveTab('documents')}
              className="text-xs text-amber-600 font-semibold hover:underline"
            >
              {lang === 'ar' ? 'إدارة' : 'Manage'}
            </button>
          </div>

          <div className="space-y-2.5">
            {(activeTrip.documents || []).slice(0, 3).map(doc => (
              <div key={doc.id} className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-700/50 flex items-start justify-between text-xs">
                <div>
                  <div className="font-bold text-stone-900 dark:text-white">{doc.title}</div>
                  <div className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">
                    {doc.holderName} {doc.documentNumber ? `• ${doc.documentNumber}` : ''}
                  </div>
                </div>
                {doc.expiryDate && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-medium shrink-0 ms-2">
                    {doc.expiryDate}
                  </span>
                )}
              </div>
            ))}

            {(activeTrip.documents || []).length === 0 && (
              <div className="text-center py-4 text-xs text-stone-600 dark:text-stone-300">
                {lang === 'ar' ? 'لم تقم بحفظ أي وثائق بعد' : 'No documents attached yet'}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
