import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { X, MapPin, Calendar, DollarSign, Car } from 'lucide-react';
import { Trip, CurrencyCode, PlannedStop } from '../../types/travel';
import { YEMEN_GOVERNORATES } from '../../data/yemenData';

interface NewTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTripModal: React.FC<NewTripModalProps> = ({ isOpen, onClose }) => {
  const { lang, addTrip } = useTravel();

  const [fromGov, setFromGov] = useState('عدن');
  const [toGov, setToGov] = useState('حضرموت');
  const [titleAr, setTitleAr] = useState('رحلة النقل المجدولة: من عدن إلى حضرموت');
  const [titleEn, setTitleEn] = useState('Intercity Transit: Aden to Hadhramaut');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]);
  const [budget, setBudget] = useState(150000);
  const [currency, setCurrency] = useState<CurrencyCode>('YER');
  const [travelers, setTravelers] = useState('أنا والعائلة');
  const [description, setDescription] = useState('رحلة طريق برية مع محطات استراحة محددة وضمان سيارة بديلة وتتبع مباشر لطمأنة العائلة.');

  if (!isOpen) return null;

  const handleGovChange = (from: string, to: string) => {
    setFromGov(from);
    setToGov(to);
    setTitleAr(`رحلة النقل البري: من ${from} إلى ${to}`);
    setTitleEn(`Intercity Transit: ${from} to ${to}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const originGovObj = YEMEN_GOVERNORATES.find(g => g.nameAr === fromGov) || YEMEN_GOVERNORATES[0];
    const destGovObj = YEMEN_GOVERNORATES.find(g => g.nameAr === toGov) || YEMEN_GOVERNORATES[2];

    const initialStops: PlannedStop[] = [
      {
        id: `stop-${Date.now()}-1`,
        nameAr: `استراحة الطريق الأولى وتناول الطعام (${fromGov})`,
        nameEn: `Route Rest & Food Stop (${fromGov})`,
        type: 'rest_food',
        estimatedTime: '09:00',
        durationMinutes: 30,
        locationName: `طريق ${fromGov} - محطة الاستراحة المركزية`,
        isCompleted: false
      },
      {
        id: `stop-${Date.now()}-2`,
        nameAr: `نقطة التفتيش المعتمدة (${fromGov} / ${toGov})`,
        nameEn: 'Verified Checkpoint',
        type: 'checkpoint',
        estimatedTime: '11:30',
        durationMinutes: 15,
        locationName: `الحد الفاصل بين المحافظتين`,
        isCompleted: false
      },
      {
        id: `stop-${Date.now()}-3`,
        nameAr: `استراحة صلاة الظهر والتزود بالوقود (${toGov})`,
        nameEn: `Prayer & Fuel Stop (${toGov})`,
        type: 'prayer',
        estimatedTime: '12:45',
        durationMinutes: 25,
        locationName: `مدخل ${toGov}`,
        isCompleted: false
      }
    ];

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      title: titleEn.trim() || titleAr.trim(),
      titleAr: titleAr.trim() || titleEn.trim(),
      destination: `${toGov}، اليمن`,
      country: 'اليمن',
      origin: fromGov,
      originGovernorate: fromGov,
      destinationGovernorate: toGov,
      coverImage: destGovObj.image,
      startDate,
      endDate,
      budget: Number(budget) || 0,
      currency,
      travelers: travelers.split(',').map(t => t.trim()).filter(Boolean),
      description: description.trim() || 'رحلة برية مجدولة ضمن شبكة النقل بين محافظات اليمن الـ 22.',
      coordinates: destGovObj.coordinates,
      isPlanApproved: true,
      trackingCode: `YEM-${Math.floor(1000 + Math.random() * 9000)}`,
      assignedDriver: {
        name: 'كابتن معتمد — سَفَر',
        phone: '+967 777 000 111',
        whatsapp: '+967 777 000 111',
        vehicleModel: 'تويوتا لاندكروزر برادو',
        plateNumber: 'خصوصي معتمد',
        isVerified: true,
        hasBackupCarCommitment: true
      },
      plannedStops: initialStops,
      days: [
        {
          id: `day-${Date.now()}-1`,
          dayNumber: 1,
          date: startDate,
          title: `انطلاق الرحلة من ${fromGov} إلى ${toGov}`,
          titleAr: `انطلاق الرحلة من ${fromGov} إلى ${toGov}`,
          activities: [
            {
              id: `act-${Date.now()}-1`,
              dayId: `day-${Date.now()}-1`,
              category: 'transport',
              time: '07:00 صباحاً',
              title: `تجمع الركاب والانطلاق من فرزة ${fromGov}`,
              titleAr: `تجمع الركاب والانطلاق من فرزة ${fromGov}`,
              description: 'فحص المركبة المسبق، ترتيب الأمتعة في الحقائب، وتفعيل رمز التتبع العائلي.',
              location: fromGov,
              isCompleted: false
            }
          ]
        }
      ],
      bookings: [],
      expenses: [],
      documents: [],
      packingList: [],
      stories: []
    };

    addTrip(newTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              {lang === 'ar' ? 'تخطيط خط سير رحلة جديدة في اليمن' : 'Plan Inter-Governorate Route'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Origin & Destination Governorates */}
          <div className="grid grid-cols-2 gap-3 bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'محافظة الانطلاق (من)' : 'From Governorate'}
              </label>
              <select
                value={fromGov}
                onChange={(e) => handleGovChange(e.target.value, toGov)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
              >
                {YEMEN_GOVERNORATES.map(g => (
                  <option key={g.id} value={g.nameAr}>{g.nameAr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'محافظة الوصول (إلى)' : 'To Governorate'}
              </label>
              <select
                value={toGov}
                onChange={(e) => handleGovChange(fromGov, e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
              >
                {YEMEN_GOVERNORATES.map(g => (
                  <option key={g.id} value={g.nameAr}>{g.nameAr}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'ar' ? 'عنوان الرحلة' : 'Trip Title'}
            </label>
            <input
              type="text"
              required
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'تاريخ الانطلاق' : 'Start Date'}
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'تاريخ الوصول' : 'End Date'}
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'الميزانية التقديرية' : 'Estimated Budget'}
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'العملة' : 'Currency'}
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              >
                <option value="YER">YER (ريال يمني)</option>
                <option value="SAR">SAR (ريال سعودي)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'ar' ? 'المسافرون (مفصولين بفواصل)' : 'Travelers (comma separated)'}
            </label>
            <input
              type="text"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              placeholder="سالم، عائشة، طارق"
              className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'ar' ? 'وصف أو ملاحظات خط السير' : 'Trip Goal / Summary'}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="تفاصيل الرحلة والاحتياجات..."
              className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition"
            >
              {lang === 'ar' ? 'حفظ وتوليد خطة السير' : 'Create Route Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
