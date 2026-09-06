import React, { useState, useRef, useEffect } from 'react';
import { InterCityTripListing, SocialCampaignType, SocialCopyTone, SocialPostGenerated, TransportOffice } from '../types/travel';
import { useTravel } from '../context/TravelContext';
import { generateSocialMediaCampaign } from '../services/aiSocialPosterService';
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
  Tag
} from 'lucide-react';

interface SocialMediaAutomatorProps {
  initialListing?: InterCityTripListing | null;
  initialOffice?: TransportOffice | null;
  initialCampaignType?: SocialCampaignType;
  onClose?: () => void;
  isModalMode?: boolean;
}

export const SocialMediaAutomator: React.FC<SocialMediaAutomatorProps> = ({
  initialListing,
  initialOffice,
  initialCampaignType = 'driver_recruitment',
  onClose,
  isModalMode = false
}) => {
  const { lang, intercityListings, transportOffices, addNotification } = useTravel();

  const [campaignType, setCampaignType] = useState<SocialCampaignType>(initialCampaignType);
  const [selectedTone, setSelectedTone] = useState<SocialCopyTone>('authentic_yemeni');
  const [selectedListingId, setSelectedListingId] = useState<string>(initialListing?.id || (intercityListings[0]?.id || ''));
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>(initialOffice?.id || (transportOffices[0]?.id || ''));
  const [cardFormat, setCardFormat] = useState<'square' | 'story'>('square');
  const [activePlatformTab, setActivePlatformTab] = useState<'whatsapp' | 'facebook' | 'instagram' | 'twitter' | 'telegram'>('whatsapp');
  
  // Copy feedback states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [customPhone, setCustomPhone] = useState('+967 733 900 111');
  const [customBadgeText, setCustomBadgeText] = useState('');

  const visualCardRef = useRef<HTMLDivElement>(null);

  // Sync state when props change
  useEffect(() => {
    if (initialListing) {
      setSelectedListingId(initialListing.id);
      setCampaignType('trip_announcement');
    } else if (initialOffice) {
      setSelectedOfficeId(initialOffice.id);
    }
    if (initialCampaignType) {
      setCampaignType(initialCampaignType);
    }
  }, [initialListing, initialOffice, initialCampaignType]);

  const currentListing = intercityListings.find(l => l.id === selectedListingId) || intercityListings[0] || null;
  const currentOffice = transportOffices.find(o => o.id === selectedOfficeId) || transportOffices[0] || null;

  // Generate current campaign payload
  const generatedPost: SocialPostGenerated = generateSocialMediaCampaign({
    campaignType,
    tone: selectedTone,
    listing: currentListing,
    office: currentOffice
  });

  const handleCopyText = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2200);
    addNotification({
      title: 'Copied to Clipboard',
      titleAr: 'تم النسخ للحافظة بنجاح 📋',
      message: 'Post text copied, ready to paste on social media.',
      messageAr: 'تم نسخ نص المنشور الدعائي، يمكنك لصقه ومشاركته فوراً.',
      type: 'booking_confirmed',
      priority: 'low'
    });
  };

  const handleShareToWhatsApp = () => {
    const text = encodeURIComponent(generatedPost.formattedWhatsAppMsg);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareToTwitter = () => {
    const text = encodeURIComponent(generatedPost.twitterPostText || generatedPost.headlineAr);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleDownloadVisualCard = async () => {
    if (!visualCardRef.current) return;
    setIsExportingImage(true);
    try {
      const canvas = await html2canvas(visualCardRef.current, {
        scale: 2.5, // High resolution for mobile retina
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0c0a09'
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `safar-yemen-free-${campaignType}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      addNotification({
        title: 'Banner Saved',
        titleAr: 'تم تصدير البنر التسويقي بنجاح 🖼️',
        message: 'High resolution promotional card downloaded.',
        messageAr: 'تم تنزيل الصورة التسويقية بجودة عالية وجاهزة للنشر.',
        type: 'booking_confirmed',
        priority: 'low'
      });
    } catch (err) {
      console.error('Failed to export card image:', err);
    } finally {
      setIsExportingImage(false);
    }
  };

  return (
    <div className="bg-stone-900 text-stone-100 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden flex flex-col w-full">
      
      {/* Top Banner Header */}
      <div className="p-4 sm:p-6 border-b border-stone-800 bg-stone-950 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                {lang === 'ar' ? 'وحدة الأتمتة وصناعة المنشورات الدعائية (SocialMediaAutomator)' : 'Social Media Automator & Ad Studio'}
              </h2>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{lang === 'ar' ? 'مجاني 100%' : '100% Free'}</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              {lang === 'ar' 
                ? 'إنشاء منشورات ترويجية احترافية فورية (تسجيل مجاني للسائقين والمسافرين) وتجهيزها بضغطة زر لمنصات التواصل' 
                : 'Instantly generate high-converting promotional ads & graphic banners highlighting 100% free registration.'}
            </p>
          </div>
        </div>

        {onClose && isModalMode && (
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition text-xs font-bold"
          >
            {lang === 'ar' ? 'إغلاق ✕' : 'Close ✕'}
          </button>
        )}
      </div>

      {/* Main Grid: Controls & Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-stone-800">
        
        {/* LEFT COLUMN: CAMPAIGN BUILDER CONTROLS (6 COLS) */}
        <div className="lg:col-span-6 p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          
          {/* 1. Campaign Types (Two Main Types + Trip/Office) */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-stone-200 flex items-center justify-between">
              <span>{lang === 'ar' ? '١. نوع المنشور الدعائي المطلوب:' : '1. Select Campaign Goal:'}</span>
              <span className="text-[11px] text-amber-400 font-bold">{lang === 'ar' ? 'تسجيل مجاني 100%' : '100% Free Access'}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Type 1: Driver Attraction */}
              <button
                type="button"
                onClick={() => setCampaignType('driver_recruitment')}
                className={`p-3.5 rounded-2xl border text-start transition flex items-start gap-3 ${
                  campaignType === 'driver_recruitment'
                    ? 'bg-amber-950/70 border-amber-500 text-amber-200 ring-2 ring-amber-500/50 shadow-md'
                    : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:bg-stone-800'
                }`}
              >
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>{lang === 'ar' ? 'استقطاب السائقين والكباتن' : 'Driver Recruitment'}</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-md font-mono">مجاني</span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1 leading-snug">
                    {lang === 'ar' ? 'تسجيل مجاني 100%، ملء رحلات الراجع، بدون عمولات وسيط' : 'Free registration, fill return trips, 0% fees'}
                  </div>
                </div>
              </button>

              {/* Type 2: Passenger Attraction */}
              <button
                type="button"
                onClick={() => setCampaignType('passenger_recruitment')}
                className={`p-3.5 rounded-2xl border text-start transition flex items-start gap-3 ${
                  campaignType === 'passenger_recruitment'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50 shadow-md'
                    : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:bg-stone-800'
                }`}
              >
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>{lang === 'ar' ? 'استقطاب المسافرين والعائلات' : 'Passenger & Family Promo'}</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-md font-mono">مجاني</span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1 leading-snug">
                    {lang === 'ar' ? 'حجز مجاني، تتبع حي مشفر بالهاتف، وضمان سيارة بديلة' : 'Free booking, mobile GPS tracking, backup car'}
                  </div>
                </div>
              </button>

              {/* Type 3: Open Trip Announcement */}
              <button
                type="button"
                onClick={() => setCampaignType('trip_announcement')}
                className={`p-3.5 rounded-2xl border text-start transition flex items-start gap-3 ${
                  campaignType === 'trip_announcement'
                    ? 'bg-amber-950/70 border-amber-500 text-amber-200 ring-2 ring-amber-500/50 shadow-md'
                    : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:bg-stone-800'
                }`}
              >
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">
                    {lang === 'ar' ? 'إعلان رحلة محددة ومقاعد شاغرة' : 'Inter-City Trip Alert'}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1 leading-snug">
                    {lang === 'ar' ? 'نشر خط سير، عدد المقاعد، السعر، وكود الأمان' : 'Broadcast departure, seats, price & safety code'}
                  </div>
                </div>
              </button>

              {/* Type 4: Office Showcase */}
              <button
                type="button"
                onClick={() => setCampaignType('office_showcase')}
                className={`p-3.5 rounded-2xl border text-start transition flex items-start gap-3 ${
                  campaignType === 'office_showcase'
                    ? 'bg-purple-950/70 border-purple-500 text-purple-200 ring-2 ring-purple-500/50 shadow-md'
                    : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:bg-stone-800'
                }`}
              >
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">
                    {lang === 'ar' ? 'إعلان شركة / مكتب نقل' : 'Office & Fleet Showcase'}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1 leading-snug">
                    {lang === 'ar' ? 'إبراز الأسطول الحديث والرحلات اليومية والطرود' : 'Showcase VIP bus fleets & cargo shipping'}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Specific Trip Selection if applicable */}
          {campaignType === 'trip_announcement' && (
            <div className="space-y-1.5 bg-stone-800/50 p-3.5 rounded-2xl border border-stone-700">
              <label className="text-xs font-bold text-stone-300 block">
                {lang === 'ar' ? 'اختر الرحلة المطلوب الإعلان عنها:' : 'Select Trip:'}
              </label>
              <select
                value={selectedListingId}
                onChange={e => setSelectedListingId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs font-bold text-amber-300 focus:ring-2 focus:ring-amber-500 outline-hidden"
              >
                {intercityListings.map(listing => (
                  <option key={listing.id} value={listing.id}>
                    {listing.fromGovernorate} ← {listing.toGovernorate} ({listing.departureDate} — {listing.availableSeats} مقاعد — {listing.vehicleModel})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 3. Tone of Voice Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-300 block">
              {lang === 'ar' ? '٢. نبرة الخطاب والتنسيق:' : '2. Tone of Voice:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'authentic_yemeni' as SocialCopyTone, labelAr: '🇾🇪 لهجة يمنية أصيلة', labelEn: 'Authentic Yemeni' },
                { id: 'family_safety' as SocialCopyTone, labelAr: '🛡️ أمان العائلة', labelEn: 'Family Safety' },
                { id: 'professional_saas' as SocialCopyTone, labelAr: '💼 رسمي وتجاري', labelEn: 'Professional' },
                { id: 'action_urgent' as SocialCopyTone, labelAr: '⚡ عاجل وحماسي', labelEn: 'Action Urgent' }
              ].map(tone => (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => setSelectedTone(tone.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition text-center ${
                    selectedTone === tone.id
                      ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                      : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  {lang === 'ar' ? tone.labelAr : tone.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Platform Ready-made Copies */}
          <div className="space-y-3 bg-stone-950 p-4 rounded-2xl border border-stone-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400">
                {lang === 'ar' ? '٣. قوالب المشاركة المجهزة للمنصات:' : '3. Ready-Made Platform Formats:'}
              </span>
              <span className="text-[10px] text-stone-400">تنسيق مخصص لكل تطبيق</span>
            </div>

            {/* Platform Sub-Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'whatsapp' as const, label: 'واتساب WhatsApp 🟢', color: 'text-emerald-400' },
                { id: 'facebook' as const, label: 'فيسبوك Facebook 📘', color: 'text-blue-400' },
                { id: 'instagram' as const, label: 'إنستغرام Instagram 📸', color: 'text-pink-400' },
                { id: 'twitter' as const, label: 'تويتر / X 🐦', color: 'text-sky-400' },
                { id: 'telegram' as const, label: 'تيليجرام Telegram ✈️', color: 'text-sky-300' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActivePlatformTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition border ${
                    activePlatformTab === tab.id
                      ? 'bg-stone-800 border-stone-600 text-white shadow-xs'
                      : 'border-transparent text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <span className={tab.color}>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab 1: WhatsApp Format */}
            {activePlatformTab === 'whatsapp' && (
              <div className="space-y-2.5">
                <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 text-xs text-stone-200 font-mono whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                  {generatedPost.formattedWhatsAppMsg}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareToWhatsApp}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'إرسال مباشر إلى واتساب 📲' : 'Share on WhatsApp'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyText(generatedPost.formattedWhatsAppMsg, 'whatsapp')}
                    className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    {copiedKey === 'whatsapp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'whatsapp' ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ النص' : 'Copy')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Facebook Format */}
            {activePlatformTab === 'facebook' && (
              <div className="space-y-2.5">
                <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 text-xs text-stone-200 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                  {generatedPost.facebookPostText || generatedPost.fullFormattedCaption}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyText(generatedPost.facebookPostText || generatedPost.fullFormattedCaption, 'facebook')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    {copiedKey === 'facebook' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'facebook' ? (lang === 'ar' ? 'تم نسخ منشور فيسبوك!' : 'Copied!') : (lang === 'ar' ? 'نسخ بوست الفيسبوك مع الهاشتاجات' : 'Copy Facebook Post')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Instagram Format */}
            {activePlatformTab === 'instagram' && (
              <div className="space-y-2.5">
                <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 text-xs text-stone-200 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                  {generatedPost.fullFormattedCaption}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyText(generatedPost.fullFormattedCaption, 'instagram')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    {copiedKey === 'instagram' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'instagram' ? (lang === 'ar' ? 'تم نسخ كابشن إنستغرام!' : 'Copied!') : (lang === 'ar' ? 'نسخ كابشن إنستغرام والوسوم' : 'Copy Instagram Caption')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 4: Twitter / X Format */}
            {activePlatformTab === 'twitter' && (
              <div className="space-y-2.5">
                <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 text-xs text-stone-200 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                  {generatedPost.twitterPostText || generatedPost.headlineAr}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareToTwitter}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'نشر تغريدة فورية على X 🐦' : 'Tweet on X'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyText(generatedPost.twitterPostText || generatedPost.headlineAr, 'twitter')}
                    className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    {copiedKey === 'twitter' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'twitter' ? 'تم!' : 'نسخ'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 5: Telegram Format */}
            {activePlatformTab === 'telegram' && (
              <div className="space-y-2.5">
                <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 text-xs text-stone-200 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                  {generatedPost.telegramPostText || generatedPost.fullFormattedCaption}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyText(generatedPost.telegramPostText || generatedPost.fullFormattedCaption, 'telegram')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    {copiedKey === 'telegram' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'telegram' ? (lang === 'ar' ? 'تم نسخ رسالة تيليجرام!' : 'Copied!') : (lang === 'ar' ? 'نسخ نص لقنوات ومجموعات تيليجرام' : 'Copy Telegram Message')}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: VISUAL AD GRAPHIC GENERATOR (6 COLS) */}
        <div className="lg:col-span-6 p-4 sm:p-6 flex flex-col justify-between space-y-4 bg-stone-950/60">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black text-white">
                  {lang === 'ar' ? 'معاينة البنر التسويقي الجرافيكي المباشر:' : 'Live Graphic Ad Preview:'}
                </span>
              </div>

              {/* Format Toggle (Square vs Story) */}
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

            {/* VISUAL RENDER CONTAINER (For html2canvas export) */}
            <div className="flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 rounded-3xl border border-stone-800/80">
              <div
                ref={visualCardRef}
                style={{
                  aspectRatio: cardFormat === 'square' ? '1/1' : '9/16',
                  maxWidth: cardFormat === 'square' ? '380px' : '320px',
                  width: '100%'
                }}
                className={`rounded-3xl p-6 flex flex-col justify-between text-white relative overflow-hidden shadow-2xl border border-stone-700 bg-gradient-to-br ${generatedPost.visualTheme.bgGradient}`}
              >
                {/* Background ambient elements */}
                <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-black/40 blur-2xl pointer-events-none"></div>

                {/* Top Bar on Banner */}
                <div className="relative z-10 flex items-center justify-between gap-2 border-b border-white/15 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white font-black text-sm">
                      🇾🇪
                    </div>
                    <div>
                      <div className="text-xs font-black tracking-wide">منصة المسافر (Traveler)</div>
                      <div className="text-[9px] text-white/75 font-mono">TRAVELER YEMEN • 2026</div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black border border-white/30 text-amber-200">
                    {customBadgeText || generatedPost.visualTheme.badgeTextAr}
                  </span>
                </div>

                {/* Middle Content on Banner */}
                <div className="relative z-10 my-auto py-4 space-y-3 text-center">
                  <div className="inline-block px-3 py-1 rounded-xl bg-amber-500 text-stone-950 font-black text-[11px] shadow-lg">
                    🎁 تسجيل واستخدام مجاني 100%
                  </div>

                  <h3 className="text-base sm:text-lg font-black leading-snug drop-shadow-md">
                    {generatedPost.headlineAr.slice(0, 75)}...
                  </h3>

                  <div className="p-3 rounded-2xl bg-black/35 backdrop-blur-sm border border-white/15 text-start space-y-1.5 text-xs">
                    {campaignType === 'driver_recruitment' && (
                      <>
                        <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>تسجيل مجاني وبدون أي رسوم للكباتن</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/90">
                          <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                          <span>ركاب محجوزين مسبقاً وملء رحلات الراجع</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/90">
                          <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                          <span>كود تتبع عائلي وأمان متكامل للطريق</span>
                        </div>
                      </>
                    )}

                    {campaignType === 'passenger_recruitment' && (
                      <>
                        <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>حجز مجاني وتتبع حي بالهاتف للأهل 🛰️</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/90">
                          <Check className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                          <span>ضمان السيارة البديلة في كافة العقبات</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/90">
                          <Check className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                          <span>حجز بالنفر أو سيارة كاملة بأسعار شفافة</span>
                        </div>
                      </>
                    )}

                    {campaignType === 'trip_announcement' && (
                      <>
                        <div className="flex items-center justify-between text-amber-300 font-bold border-b border-white/10 pb-1">
                          <span>{currentListing?.fromGovernorate} ← {currentListing?.toGovernorate}</span>
                          <span>{currentListing?.availableSeats} مقاعد</span>
                        </div>
                        <div className="flex items-center justify-between text-white/90 text-[11px] pt-0.5">
                          <span>🗓️ {currentListing?.departureDate}</span>
                          <span className="font-mono text-emerald-300">{currentListing?.pricePerSeat?.toLocaleString()} {currentListing?.currency}</span>
                        </div>
                        <div className="text-[10px] text-amber-200 font-mono text-center pt-1">
                          🔒 كود الأمان العائلي: {currentListing?.familyTrackingCode || 'YEM-AD-MK-772'}
                        </div>
                      </>
                    )}

                    {campaignType === 'office_showcase' && (
                      <>
                        <div className="font-bold text-purple-200">{currentOffice?.nameAr || 'مكاتب النقل المعتمدة'}</div>
                        <div className="text-white/80 text-[11px]">باصات VIP • رحلات يومية • شحن طرود سريع</div>
                        <div className="text-emerald-300 text-[11px] font-bold">🎁 حجز مجاني 100% عبر تطبيق المسافر</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Footer on Banner */}
                <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between gap-2 text-[10px]">
                  <div className="text-start">
                    <div className="text-white/70">للتسجيل والحجز الفوري:</div>
                    <div className="font-bold font-mono text-white text-xs">{customPhone}</div>
                  </div>
                  <div className="px-2.5 py-1 rounded-xl bg-white text-stone-950 font-black text-[10px] shadow-sm">
                    safar-yemen.app
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Action to Download Banner */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              disabled={isExportingImage}
              onClick={handleDownloadVisualCard}
              className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-stone-950 text-xs font-black shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>
                {isExportingImage 
                  ? (lang === 'ar' ? 'جاري تصدير الصورة بدقة عالية...' : 'Exporting...') 
                  : (lang === 'ar' ? 'تحميل البنر التسويقي بجودة عالية (PNG) 🖼️' : 'Download Graphic Banner (PNG)')}
              </span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
