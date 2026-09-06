import React, { useState } from 'react';
import { TransportOffice, InterCityTripListing } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';
import { 
  X, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Car, 
  Bus, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Users, 
  Building2, 
  Award, 
  Share2, 
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface CompanyShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  office: TransportOffice | null;
  onOpenBookingForTrip?: (listing: InterCityTripListing) => void;
  onOpenSocialPosterForOffice?: (office: TransportOffice) => void;
}

export const CompanyShowcaseModal: React.FC<CompanyShowcaseModalProps> = ({
  isOpen,
  onClose,
  office,
  onOpenBookingForTrip,
  onOpenSocialPosterForOffice
}) => {
  const { lang, intercityListings } = useTravel();
  const [activeTab, setActiveTab] = useState<'overview' | 'fleet' | 'trips' | 'branches'>('overview');
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);

  if (!isOpen || !office) return null;

  // Filter active trips posted under this company/office
  const officeTrips = intercityListings.filter(
    trip => trip.operatorType === 'company' && (
      trip.officeId === office.id ||
      (trip.companyName && trip.companyName.toLowerCase().includes(office.nameAr.toLowerCase().split(' ')[1] || '')) ||
      (trip.companyName && office.nameAr.toLowerCase().includes(trip.companyName.toLowerCase()))
    )
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-stone-900 dark:text-stone-100"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header Cover & Branding */}
        <div className="relative h-44 sm:h-56 w-full bg-stone-900 shrink-0 overflow-hidden">
          <img 
            src={office.coverImage} 
            alt={office.nameAr}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 end-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition z-20"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Social Auto-Poster Quick Action */}
          {onOpenSocialPosterForOffice && (
            <button
              onClick={() => {
                onClose();
                onOpenSocialPosterForOffice(office);
              }}
              className="absolute top-4 start-4 px-3 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition z-20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? '📢 توليد بوست تسويقي ذكي' : 'AI Social Media Ad'}</span>
            </button>
          )}

          {/* Company Identity Overlay */}
          <div className="absolute bottom-4 start-4 end-4 flex items-end justify-between gap-4 z-10">
            <div className="flex items-end gap-3.5">
              <img 
                src={office.logo} 
                alt={office.nameAr}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-white p-1 border-2 border-amber-500 shadow-xl shrink-0"
              />
              <div className="text-white space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base sm:text-xl font-black tracking-tight">
                    {office.nameAr}
                  </h2>
                  {office.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      {lang === 'ar' ? 'مكتب معتمد رسمي' : 'Verified Fleet'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-200 line-clamp-1 max-w-lg">
                  {office.taglineAr}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-amber-300 font-semibold">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{office.rating} ({office.reviewCount} تقييم مسافر)</span>
                  </span>
                  <span>•</span>
                  <span>تأسس عام {office.establishedYear}</span>
                </div>
              </div>
            </div>

            {/* Direct Contact Quick Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <a
                href={`https://wa.me/${office.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`السلام عليكم، استفسار عن خدمات وحجوزات ${office.nameAr} عبر منصة المسافر (Traveler)`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>واتساب</span>
              </a>
              <a
                href={`tel:${office.phone}`}
                className="px-3 py-2 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
              >
                <Phone className="w-4 h-4" />
                <span>اتصال</span>
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/80 px-4 sm:px-6 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'نظرة عامة والخدمات' : 'Overview & Services'}
          </button>
          
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'fleet'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <span>{lang === 'ar' ? 'معرض أسطول السيارات والباصات' : 'Fleet Showcase'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
              {office.fleetVehicles.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('trips')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'trips'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <span>{lang === 'ar' ? 'الرحلات المجدولة المفتوحة' : 'Scheduled Trips'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
              {officeTrips.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('branches')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'branches'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <span>{lang === 'ar' ? 'الفروع والمكاتب بالمحافظات' : 'Branches'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold">
              {office.branches.length}
            </span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* About Section */}
              <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-700/60 space-y-3">
                <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'ar' ? 'عن الشركة وتاريخها' : 'About the Fleet'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {office.aboutAr}
                </p>
                <div className="pt-2 text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>{office.licenseNumber}</span>
                </div>
              </div>

              {/* Guarantees & Features */}
              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'ar' ? 'مزايا ومعايير الأمان والراحة المعتمدة' : 'Verified Safety & Quality Features'}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {office.features.map((feat, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 text-xs text-stone-800 dark:text-stone-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo Showcase Gallery */}
              {office.fleetGallery.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white">
                    {lang === 'ar' ? 'معرض صور الشركة والمركبات' : 'Office & Vehicle Gallery'}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {office.fleetGallery.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Gallery"
                        onClick={() => setSelectedGalleryImg(img)}
                        className="w-full h-28 object-cover rounded-xl border border-stone-200 dark:border-stone-700 cursor-pointer hover:opacity-90 transition shadow-xs"
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: FLEET VEHICLES */}
          {activeTab === 'fleet' && (
            <div className="space-y-4">
              <div className="text-xs text-stone-600 dark:text-stone-400">
                {lang === 'ar' 
                  ? 'يتكون أسطول الشركة من مركبات حديثة مفحوصة دورياً ومجهزة بكافة سبل الراحة والأمان للمسافرين:' 
                  : 'All fleet vehicles are inspected, climate-controlled, and equipped for maximum comfort:'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {office.fleetVehicles.map(v => (
                  <div 
                    key={v.id}
                    className="bg-stone-50 dark:bg-stone-800/70 rounded-2xl border border-stone-200 dark:border-stone-700 p-4 space-y-3 shadow-xs"
                  >
                    <div className="relative h-36 rounded-xl overflow-hidden bg-stone-900">
                      <img 
                        src={v.photoUrl} 
                        alt={v.model}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 end-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-white backdrop-blur-md">
                        موديل {v.year}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white">
                        {v.model}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                        <span>رقم اللوحة: {v.plateNumber}</span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                          {v.totalSeats} مقاعد
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-stone-200/60 dark:border-stone-700/60">
                      {v.amenities.map((am, i) => (
                        <span 
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
                        >
                          {am}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SCHEDULED TRIPS */}
          {activeTab === 'trips' && (
            <div className="space-y-4">
              {officeTrips.length === 0 ? (
                <div className="text-center py-12 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 space-y-2">
                  <Car className="w-8 h-8 text-stone-400 mx-auto" />
                  <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    {lang === 'ar' ? 'لا توجد رحلات مجدولة حالياً لهذا المكتب' : 'No trips currently scheduled'}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {lang === 'ar' ? 'يمكنك التواصل مباشرة مع المكتب لطلب مشوار خاص أو الاستفسار عن المواعيد القادمة' : 'Contact office directly for charter bookings'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {officeTrips.map(trip => (
                    <div 
                      key={trip.id}
                      className="bg-stone-50 dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-white">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          <span>{trip.fromGovernorate} ({trip.fromCity})</span>
                          <span className="text-stone-400 font-bold">{lang === 'ar' ? '←' : '➔'}</span>
                          <span>{trip.toGovernorate} ({trip.toCity})</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {trip.departureDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {trip.departureTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {trip.availableSeats} مقاعد شاغرة
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200 dark:border-stone-700">
                        <div className="text-start sm:text-end">
                          <div className="text-sm font-black text-amber-600 dark:text-amber-400">
                            {trip.pricePerSeat.toLocaleString()} {trip.currency}
                          </div>
                          <div className="text-[10px] text-stone-500">للمقعد بالنفر</div>
                        </div>

                        {onOpenBookingForTrip && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenBookingForTrip(trip);
                            }}
                            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-xs"
                          >
                            {lang === 'ar' ? 'احجز الآن' : 'Book Now'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BRANCHES */}
          {activeTab === 'branches' && (
            <div className="space-y-4">
              <div className="text-xs text-stone-600 dark:text-stone-400">
                {lang === 'ar' ? 'فروع ومكاتب الحجز والاستقبال المعتمدة في المحافظات:' : 'Official branches & booking offices across governorates:'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {office.branches.map(br => (
                  <div 
                    key={br.id}
                    className="bg-stone-50 dark:bg-stone-800/70 rounded-2xl border border-stone-200 dark:border-stone-700 p-4 space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/50">
                        {br.governorate} — {br.city}
                      </span>
                      {br.workingHours && (
                        <span className="text-[10px] text-stone-500">
                          {br.workingHours}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span>{br.address}</span>
                    </div>

                    <div className="pt-2 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-xs">
                      <a 
                        href={`tel:${br.phone}`}
                        className="text-stone-700 dark:text-stone-300 hover:text-amber-600 font-semibold flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-stone-500" />
                        <span>{br.phone}</span>
                      </a>

                      {br.whatsapp && (
                        <a 
                          href={`https://wa.me/${br.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>واتساب</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-500 dark:text-stone-400">
            {lang === 'ar' ? 'جميع الرحلات والمركبات خاضعة لبروتوكول الأمان العائلي وضمان المسافر (Traveler) 🇾🇪' : 'All trips comply with Traveler Family Safety Protocol'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-xs font-bold transition"
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
