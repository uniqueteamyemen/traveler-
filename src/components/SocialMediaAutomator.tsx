import React, { useState, useRef, useEffect } from 'react';
import { 
  InterCityTripListing, 
  PassengerRideRequest,
  SocialCampaignType, 
  SocialCopyTone, 
  SocialPostGenerated, 
  TransportOffice,
  CarouselSlideCard,
  SocialCarouselPackage
} from '../types/travel';
import { useTravel } from '../context/TravelContext';
import { 
  generateSocialMediaCampaign, 
  generateCarouselAdPackage, 
  cleanWhatsAppNumber,
  DEFAULT_WHATSAPP_BOT_NUMBER,
  DEFAULT_WHATSAPP_DISPLAY 
} from '../services/aiSocialPosterService';
import html2canvas from 'html2canvas';
import { 
  Sparkles, 
  Share2, 
  Copy, 
  Download, 
  Check, 
  MessageSquare, 
  Smartphone, 
  RotateCw, 
  Car, 
  Users, 
  ShieldCheck, 
  TrendingUp,
  Flame,
  Award,
  Send,
  Building2,
  Lock,
  ExternalLink,
  Edit3,
  CheckCircle2,
  Tag,
  ChevronLeft,
  ChevronRight,
  Layers,
  Info,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ListFilter
} from 'lucide-react';

interface SocialMediaAutomatorProps {
  initialListing?: InterCityTripListing | null;
  initialPassengerRequest?: PassengerRideRequest | null;
  initialOffice?: TransportOffice | null;
  initialCampaignType?: SocialCampaignType;
  onClose?: () => void;
  isModalMode?: boolean;
}

export const SocialMediaAutomator: React.FC<SocialMediaAutomatorProps> = ({
  initialListing,
  initialPassengerRequest,
  initialOffice,
  initialCampaignType = 'passenger_campaign_carousel',
  onClose,
  isModalMode = false
}) => {
  const { lang, intercityListings, passengerRequests, transportOffices, addNotification } = useTravel();

  // Mode: Carousel (Meta Ads) vs Single Ad
  const [suiteMode, setSuiteMode] = useState<'carousel' | 'single'>(
    initialCampaignType.includes('carousel') ? 'carousel' : 'carousel'
  );

  // Carousel Options
  const [carouselAudience, setCarouselAudience] = useState<'passengers' | 'captains'>(
    initialCampaignType === 'captain_campaign_carousel' ? 'captains' : 'passengers'
  );
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [whatsappBotPhone, setWhatsappBotPhone] = useState<string>(DEFAULT_WHATSAPP_BOT_NUMBER);
  const [selectedTone, setSelectedTone] = useState<SocialCopyTone>('authentic_yemeni');

  // Single Ad Options
  const [campaignType, setCampaignType] = useState<SocialCampaignType>(
    initialCampaignType.includes('carousel') ? 'trip_announcement' : initialCampaignType
  );
  const [selectedListingId, setSelectedListingId] = useState<string>(initialListing?.id || (intercityListings[0]?.id || ''));
  const [selectedRequestId, setSelectedRequestId] = useState<string>(initialPassengerRequest?.id || (passengerRequests[0]?.id || ''));
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>(initialOffice?.id || (transportOffices[0]?.id || ''));
  const [activePlatformTab, setActivePlatformTab] = useState<'whatsapp' | 'facebook' | 'instagram' | 'twitter' | 'telegram'>('whatsapp');

  // Common Visual Options
  const [cardFormat, setCardFormat] = useState<'square' | 'story'>('square');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [exportProgressText, setExportProgressText] = useState('');

  const visualCardRef = useRef<HTMLDivElement>(null);

  // Sync state on prop changes
  useEffect(() => {
    if (initialListing) {
      setSelectedListingId(initialListing.id);
      setCampaignType('trip_announcement');
    }
    if (initialPassengerRequest) {
      setSelectedRequestId(initialPassengerRequest.id);
      setCampaignType('captain_campaign_carousel');
      setCarouselAudience('captains');
    }
    if (initialOffice) {
      setSelectedOfficeId(initialOffice.id);
    }
    if (initialCampaignType) {
      if (initialCampaignType.includes('carousel')) {
        setSuiteMode('carousel');
        setCarouselAudience(initialCampaignType === 'captain_campaign_carousel' ? 'captains' : 'passengers');
      } else {
        setCampaignType(initialCampaignType);
      }
    }
  }, [initialListing, initialPassengerRequest, initialOffice, initialCampaignType]);

  // Active items for single post
  const currentListing = intercityListings.find(l => l.id === selectedListingId) || intercityListings[0] || null;
  const currentRequest = passengerRequests.find(r => r.id === selectedRequestId) || passengerRequests[0] || null;
  const currentOffice = transportOffices.find(o => o.id === selectedOfficeId) || transportOffices[0] || null;

  // Generate Carousel Package
  const carouselPackage: SocialCarouselPackage = generateCarouselAdPackage({
    audience: carouselAudience,
    listings: intercityListings,
    requests: passengerRequests,
    whatsappPhone: whatsappBotPhone,
    tone: selectedTone
  });

  const activeSlide: CarouselSlideCard = carouselPackage.slides[activeSlideIndex] || carouselPackage.slides[0];

  // Generate Single Post Payload
  const generatedSinglePost: SocialPostGenerated = generateSocialMediaCampaign({
    campaignType,
    tone: selectedTone,
    listing: currentListing,
    passengerRequest: currentRequest,
    office: currentOffice,
    customWhatsAppPhone: whatsappBotPhone
  });

  const handleCopyText = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2500);
    addNotification({
      title: 'Copied to Clipboard',
      titleAr: 'تم النسخ بنجاح 📋',
      message: 'Text copied to clipboard.',
      messageAr: 'تم نسخ النص ورابط الواتساب، يمكنك لصقه مباشرة في إعلانك.',
      type: 'booking_confirmed',
      priority: 'low'
    });
  };

  const handleDownloadSingleCard = async (fileNamePrefix = 'safar-ad') => {
    if (!visualCardRef.current) return;
    setIsExportingImage(true);
    setExportProgressText(lang === 'ar' ? 'جاري تصدير الصورة بدقة عالية...' : 'Exporting high-res banner...');
    try {
      const canvas = await html2canvas(visualCardRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0c0a09'
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${fileNamePrefix}-${suiteMode}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      addNotification({
        title: 'Image Downloaded',
        titleAr: 'تم تنزيل الصورة التسويقية 🖼️',
        message: 'High resolution promotional card downloaded.',
        messageAr: 'تم تنزيل بطاقة الإعلان بجودة عالية جاهزة لفيسبوك وإنستغرام.',
        type: 'booking_confirmed',
        priority: 'low'
      });
    } catch (err) {
      console.error('Failed to export card image:', err);
    } finally {
      setIsExportingImage(false);
      setExportProgressText('');
    }
  };

  return (
    <div className="bg-stone-900 text-stone-100 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden flex flex-col w-full">
      
      {/* Top Banner Header */}
      <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                {lang === 'ar' ? 'استوديو إعلانات فيسبوك وإنستغرام وبوت الواتساب' : 'Meta Carousel Ads & Social Studio'}
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{lang === 'ar' ? 'شرائح كاروسيل ذكية' : 'Carousel Ready'}</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              {lang === 'ar' 
                ? 'توليد إعلانات الشرائح المتحركة (Carousel) لفيسبوك وإنستغرام مع ربط كل شريحة برابط بوت واتساب مخصص' 
                : 'Generate Booking.com-style Meta carousel ads with per-slide WhatsApp Bot deep links.'}
            </p>
          </div>
        </div>

        {/* Studio Mode Switcher & Close */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-900 p-1 rounded-2xl border border-stone-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setSuiteMode('carousel')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                suiteMode === 'carousel'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إعلانات الكاروسيل (الشرائح)' : 'Carousel Suite'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSuiteMode('single')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                suiteMode === 'single'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'بوست فردي' : 'Single Post'}</span>
            </button>
          </div>

          {onClose && isModalMode && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition text-xs font-bold"
            >
              {lang === 'ar' ? 'إغلاق ✕' : 'Close ✕'}
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Controls & Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-stone-800">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: CONTROLS & META CAMPAIGN BUILDER (6 COLS)    */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[82vh]">
          
          {/* WhatsApp Bot Number Config (Fixed for the campaign) */}
          <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'رقم واتساب البوت المعتمد لروابط الإعلانات:' : 'WhatsApp Bot Number for Ad Links:'}</span>
              </label>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                wa.me/{cleanWhatsAppNumber(whatsappBotPhone)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={whatsappBotPhone}
                  onChange={e => setWhatsappBotPhone(e.target.value)}
                  placeholder="783622340"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-700 text-emerald-300 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setWhatsappBotPhone(DEFAULT_WHATSAPP_BOT_NUMBER)}
                className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-bold transition whitespace-nowrap"
                title="استعادة الرقم الافتراضي المعتمد"
              >
                الافتراضي ({DEFAULT_WHATSAPP_BOT_NUMBER})
              </button>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              {lang === 'ar' 
                ? 'أي شخص يضغط على زر أي شريحة في فيسبوك أو إنستغرام سيفتح له الواتساب تلقائياً مع هذا الرقم ورسالة الحجز المحددة.' 
                : 'Users clicking on any slide in Meta ads will launch WhatsApp with this number and the pre-filled trip payload.'}
            </p>
          </div>

          {/* ================= MODE 1: CAROUSEL ADS SUITE ================= */}
          {suiteMode === 'carousel' && (
            <div className="space-y-5">
              
              {/* Audience Selector */}
              <div className="space-y-2">
                <label className="text-xs font-black text-stone-200 flex items-center justify-between">
                  <span>{lang === 'ar' ? '١. اختيار نوع حملة الكاروسيل والجمهور المستهدف:' : '1. Target Audience & Carousel Type:'}</span>
                  <span className="text-[10px] text-amber-400 font-bold">فصل حملات الركاب عن الكباتن</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCarouselAudience('passengers');
                      setActiveSlideIndex(0);
                    }}
                    className={`p-3.5 rounded-2xl border text-start transition flex items-start gap-3 ${
                      carouselAudience === 'passengers'
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50 shadow-md'
                        : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:bg-stone-800'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white flex items-center gap-1.5">
                        <span>{lang === 'ar' ? '👨‍👩‍👧‍👦 حملة الركاب والعائلات' : 'Passenger & Family Promo'}</span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-md font-mono">حجز</span>
                      </div>
                      <div className="text-[11px] text-stone-400 mt-1 leading-snug">
                        {lang === 'ar' ? 'شرائح الرحلات المتاحة، المقاعد الشاغرة، وكود الأمان (أسلوب Booking.com)' : 'Available seats, fixed departures & safety tracking'}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCarouselAudience('captains');
                      setActiveSlideIndex(0);
                    }}
                    className={`p-3.5 rounded-2xl border text-start transition flex items-start gap-3 ${
                      carouselAudience === 'captains'
                        ? 'bg-amber-950/70 border-amber-500 text-amber-200 ring-2 ring-amber-500/50 shadow-md'
                        : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:bg-stone-800'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white flex items-center gap-1.5">
                        <span>{lang === 'ar' ? '🚗 حملة الكباتن وأصحاب السيارات' : 'Captain & Car Owners'}</span>
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-md font-mono">مشاوير</span>
                      </div>
                      <div className="text-[11px] text-stone-400 mt-1 leading-snug">
                        {lang === 'ar' ? 'شرائح طلبات السفر المفتوحة (عائلات/ركاب يبحثون عن صالون)، عمولة 0%' : 'Open passenger ride requests & zero commission'}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Data Freshness Indicator */}
              <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-stone-300">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>
                    {carouselAudience === 'passengers'
                      ? `تم سحب ${carouselPackage.totalSlides - 1} رحلات نشطة من قاعدة البيانات`
                      : `تم سحب ${carouselPackage.totalSlides - 1} طلبات مسافرين مفتوحة من قاعدة البيانات`}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>محدثة ومفلترة تلقائياً</span>
                </span>
              </div>

              {/* Slides Navigation Bar */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-300 flex items-center justify-between">
                  <span>{lang === 'ar' ? '٢. استعراض شرائح الكاروسيل (اختر شريحة للمعاينة):' : '2. Preview Carousel Slides:'}</span>
                  <span className="text-[11px] text-stone-400">
                    الشريحة {activeSlideIndex + 1} من {carouselPackage.totalSlides}
                  </span>
                </label>

                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {carouselPackage.slides.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 border flex items-center gap-1.5 ${
                        activeSlideIndex === idx
                          ? 'bg-amber-600 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30'
                          : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-700'
                      }`}
                    >
                      <span>{s.isCoverSlide ? '⭐ الشريحة 1 (الغلاف الثابت)' : `شريحة ${s.slideNumber}: ${s.routeFrom?.split(' ')[0] || ''} ⬅️ ${s.routeTo?.split(' ')[0] || ''}`}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Meta Carousel Links Table (Ready for Facebook Ads Manager) */}
              <div className="space-y-3 bg-stone-950 p-4 rounded-2xl border border-stone-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black text-amber-300">
                      {lang === 'ar' ? 'روابط الشرائح لمدير إعلانات Meta (Facebook & Instagram):' : 'Meta Carousel Destination Links:'}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400">انسخ والصق في مدير الإعلانات</span>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto">
                  {carouselPackage.slides.map((s) => (
                    <div key={s.id} className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-white">
                        <span>شريحة {s.slideNumber}: {s.headlineAr}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{s.isCoverSlide ? 'الغلاف' : s.seatsInfo}</span>
                      </div>
                      
                      {/* WhatsApp Deep Link */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-stone-950 px-2.5 py-1.5 rounded-lg border border-stone-800 text-[11px] font-mono text-emerald-400 truncate">
                          {s.whatsappDeepLink}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyText(s.whatsappDeepLink, `wa-${s.id}`)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition flex items-center gap-1 shrink-0"
                          title="نسخ رابط الواتساب المخصص لهذه الشريحة"
                        >
                          {copiedKey === `wa-${s.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === `wa-${s.id}` ? 'تم!' : 'نسخ رابط واتساب'}</span>
                        </button>
                      </div>

                      {/* Fallback Web URL */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-stone-950 px-2.5 py-1.5 rounded-lg border border-stone-800 text-[10px] font-mono text-stone-400 truncate">
                          رابط بديل للتطبيق: {s.fallbackWebUrl}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyText(s.fallbackWebUrl, `web-${s.id}`)}
                          className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] transition flex items-center gap-1 shrink-0"
                        >
                          {copiedKey === `web-${s.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>نسخ الرابط</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Meta Caption Copy */}
                <div className="pt-2 border-t border-stone-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-stone-400">نص الكابشن العام المقترح للإعلان:</span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(carouselPackage.metaPostCaptionAr, 'meta-caption')}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    {copiedKey === 'meta-caption' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'meta-caption' ? 'تم نسخ كابشن الإعلان!' : 'نسخ كابشن فيسبوك وإنستغرام'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ================= MODE 2: SINGLE AD POST ================= */}
          {suiteMode === 'single' && (
            <div className="space-y-5">
              
              {/* Campaign Type Selectors */}
              <div className="space-y-2">
                <label className="text-xs font-black text-stone-200 block">
                  {lang === 'ar' ? 'اختر نوع المنشور الفردي:' : 'Select Single Post Type:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'trip_announcement' as SocialCampaignType, label: 'إعلان رحلة محددة', icon: Flame },
                    { id: 'captain_campaign_carousel' as SocialCampaignType, label: 'إعلان طلب مسافر', icon: Users },
                    { id: 'driver_recruitment' as SocialCampaignType, label: 'استقطاب كباتن', icon: Car },
                    { id: 'passenger_recruitment' as SocialCampaignType, label: 'استقطاب ركاب', icon: Award }
                  ].map(item => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCampaignType(item.id)}
                        className={`p-3 rounded-2xl border text-start transition flex items-center gap-2 ${
                          campaignType === item.id
                            ? 'bg-amber-950/70 border-amber-500 text-amber-200 font-bold'
                            : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:bg-stone-800'
                        }`}
                      >
                        <IconComp className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-white">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trip selector if trip announcement */}
              {campaignType === 'trip_announcement' && (
                <div className="space-y-1.5 bg-stone-800/50 p-3.5 rounded-2xl border border-stone-700">
                  <label className="text-xs font-bold text-stone-300 block">
                    {lang === 'ar' ? 'اختر الرحلة المطلوب الإعلان عنها:' : 'Select Trip:'}
                  </label>
                  <select
                    value={selectedListingId}
                    onChange={e => setSelectedListingId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs font-bold text-amber-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    {intercityListings.map(listing => (
                      <option key={listing.id} value={listing.id}>
                        {listing.fromGovernorate} ← {listing.toGovernorate} ({listing.departureDate} — {listing.availableSeats} مقاعد)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Passenger request selector if captain recruitment by request */}
              {campaignType === 'captain_campaign_carousel' && (
                <div className="space-y-1.5 bg-stone-800/50 p-3.5 rounded-2xl border border-stone-700">
                  <label className="text-xs font-bold text-stone-300 block">
                    {lang === 'ar' ? 'اختر طلب المسافر المطلوب الإعلان عنه للكباتن:' : 'Select Passenger Request:'}
                  </label>
                  <select
                    value={selectedRequestId}
                    onChange={e => setSelectedRequestId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs font-bold text-amber-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    {passengerRequests.map(req => (
                      <option key={req.id} value={req.id}>
                        {req.passengerName}: {req.fromGovernorate} ← {req.toGovernorate} ({req.tripDate})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Ready-made Platform Copy Tabs */}
              <div className="space-y-3 bg-stone-950 p-4 rounded-2xl border border-stone-800">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {[
                    { id: 'whatsapp' as const, label: 'واتساب 🟢' },
                    { id: 'facebook' as const, label: 'فيسبوك 📘' },
                    { id: 'instagram' as const, label: 'إنستغرام 📸' },
                    { id: 'twitter' as const, label: 'تويتر / X 🐦' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActivePlatformTab(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition border ${
                        activePlatformTab === tab.id
                          ? 'bg-stone-800 border-stone-600 text-white'
                          : 'border-transparent text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 text-xs text-stone-200 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                  {activePlatformTab === 'whatsapp' && generatedSinglePost.formattedWhatsAppMsg}
                  {activePlatformTab === 'facebook' && (generatedSinglePost.facebookPostText || generatedSinglePost.fullFormattedCaption)}
                  {activePlatformTab === 'instagram' && generatedSinglePost.fullFormattedCaption}
                  {activePlatformTab === 'twitter' && (generatedSinglePost.twitterPostText || generatedSinglePost.headlineAr)}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const textToCopy = 
                        activePlatformTab === 'whatsapp' 
                          ? generatedSinglePost.formattedWhatsAppMsg 
                          : activePlatformTab === 'facebook' 
                          ? (generatedSinglePost.facebookPostText || generatedSinglePost.fullFormattedCaption)
                          : generatedSinglePost.fullFormattedCaption;
                      handleCopyText(textToCopy, 'single-copy');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    {copiedKey === 'single-copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'single-copy' ? 'تم النسخ للحافظة!' : 'نسخ نص المنشور'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: VISUAL AD GRAPHIC GENERATOR (6 COLS)        */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 p-4 sm:p-6 flex flex-col justify-between space-y-4 bg-stone-950/60">
          
          <div className="space-y-3">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black text-white">
                  {suiteMode === 'carousel' 
                    ? `معاينة الشريحة ${activeSlide.slideNumber} من الكاروسيل:` 
                    : 'معاينة البنر التسويقي:'}
                </span>
              </div>

              {/* Format Switcher */}
              <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800">
                <button
                  type="button"
                  onClick={() => setCardFormat('square')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    cardFormat === 'square' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  بوست (1:1)
                </button>
                <button
                  type="button"
                  onClick={() => setCardFormat('story')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    cardFormat === 'story' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  ستوري (9:16)
                </button>
              </div>
            </div>

            {/* VISUAL RENDER CONTAINER */}
            <div className="flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 rounded-3xl border border-stone-800/80">
              
              {/* THE GRAPHIC CARD */}
              <div
                ref={visualCardRef}
                style={{
                  aspectRatio: cardFormat === 'square' ? '1/1' : '9/16',
                  maxWidth: cardFormat === 'square' ? '400px' : '330px',
                  width: '100%'
                }}
                className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-white relative overflow-hidden shadow-2xl border-4 ${
                  carouselAudience === 'passengers' 
                    ? 'border-emerald-600/40 bg-gradient-to-br from-emerald-950 via-stone-900 to-black' 
                    : 'border-amber-600/40 bg-gradient-to-br from-amber-950 via-stone-900 to-black'
                }`}
              >
                {/* Decorative background glows */}
                <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

                {/* ======================================================== */}
                {/* 1. OUTER FRAME HEADER (الثوابت والهوية الموحدة للمنصة)    */}
                {/* ======================================================== */}
                <div className="relative z-10 border-b border-white/20 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-sm shadow-md">
                        🇾🇪
                      </div>
                      <div>
                        <div className="text-xs font-black tracking-wide text-white">منصة ترافلر (Traveler)</div>
                        <div className="text-[9px] text-amber-300 font-mono">سفر الـ 22 محافظة • أمان عائلي</div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-black border border-white/25 text-amber-200">
                      {suiteMode === 'carousel' ? activeSlide.badgeAr : (generatedSinglePost.visualTheme.badgeTextAr)}
                    </span>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* 2. INNER DYNAMIC BODY (المتغيرات بأسلوب Booking.com)      */}
                {/* ======================================================== */}
                <div className="relative z-10 my-auto py-3 space-y-3">
                  
                  {suiteMode === 'carousel' ? (
                    /* CAROUSEL SLIDE INNER CONTENT */
                    activeSlide.isCoverSlide ? (
                      /* Slide 1: Main Brand Cover */
                      <div className="space-y-3 text-center">
                        <div className="inline-block px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-black text-[11px] shadow-lg">
                          {carouselAudience === 'passengers' ? '🎁 حجز وتتبع مجاني 100%' : '🎁 عمولة 0% وتسجيل مجاني'}
                        </div>
                        <h3 className="text-base sm:text-lg font-black leading-snug drop-shadow-md text-white">
                          {activeSlide.headlineAr}
                        </h3>
                        <div className="p-3.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 text-start space-y-2 text-xs">
                          {activeSlide.highlightPoints.map((pt, i) => (
                            <div key={i} className="flex items-center gap-2 text-white/95">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span className="leading-tight">{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Slides 2..N: Dynamic Itinerary / Booking Card */
                      <div className="space-y-2.5">
                        {/* Dynamic Route Banner */}
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-white/20 backdrop-blur-sm text-center">
                          <span className="text-[10px] uppercase font-bold text-amber-300 block mb-0.5">خط السير والوجهة</span>
                          <div className="text-base sm:text-lg font-black text-white flex items-center justify-center gap-2">
                            <span>{activeSlide.routeFrom}</span>
                            <span className="text-amber-400">⬅️</span>
                            <span>{activeSlide.routeTo}</span>
                          </div>
                        </div>

                        {/* Itinerary Details Box */}
                        <div className="p-3.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 text-start space-y-2 text-xs">
                          {activeSlide.highlightPoints.map((pt, i) => (
                            <div key={i} className="flex items-center gap-2 text-stone-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                              <span className="leading-snug">{pt}</span>
                            </div>
                          ))}
                        </div>

                        {/* Action CTA Button on Card */}
                        <div className="pt-1">
                          <div className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black text-xs text-center shadow-lg flex items-center justify-center gap-1.5 border border-emerald-400/40">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{activeSlide.ctaButtonTextAr}</span>
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    /* SINGLE AD INNER CONTENT */
                    <div className="space-y-3 text-center">
                      <div className="inline-block px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-black text-[11px] shadow-lg">
                        🎁 تسجيل واستخدام مجاني 100%
                      </div>
                      <h3 className="text-base sm:text-lg font-black leading-snug drop-shadow-md">
                        {generatedSinglePost.headlineAr.slice(0, 75)}...
                      </h3>
                      <div className="p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 text-start text-xs space-y-1.5 text-stone-200">
                        <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                          <Check className="w-3.5 h-3.5" />
                          <span>تنسيق مباشر مع الكباتن والركاب</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>كود تتبع عائلي وأمان متكامل</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* ======================================================== */}
                {/* 3. OUTER FRAME FOOTER (الثوابت: رقم الواتساب الموحد)      */}
                {/* ======================================================== */}
                <div className="relative z-10 pt-3 border-t border-white/20 flex items-center justify-between gap-2 text-[10px]">
                  <div className="text-start">
                    <div className="text-white/75">للحجز والتواصل المباشر:</div>
                    <div className="font-bold font-mono text-emerald-300 text-xs flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-emerald-400" />
                      <span>{whatsappBotPhone}</span>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 rounded-xl bg-white text-stone-950 font-black text-[8.5px] shadow-sm font-mono truncate max-w-[185px]">
                    traveler.deterministicsolutionsdesign.com
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Export & Actions Toolbar */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              disabled={isExportingImage}
              onClick={() => handleDownloadSingleCard(suiteMode === 'carousel' ? `carousel-slide-${activeSlide.slideNumber}` : 'single-post')}
              className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-stone-950 text-xs font-black shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>
                {isExportingImage 
                  ? (exportProgressText || (lang === 'ar' ? 'جاري تصدير الصورة بدقة عالية...' : 'Exporting...')) 
                  : (suiteMode === 'carousel' 
                    ? (lang === 'ar' ? `تحميل الشريحة ${activeSlide.slideNumber} الحالية بجودة عالية (PNG) 🖼️` : 'Download Current Slide (PNG)') 
                    : (lang === 'ar' ? 'تحميل البنر التسويقي بجودة عالية (PNG) 🖼️' : 'Download Graphic Banner'))}
              </span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
