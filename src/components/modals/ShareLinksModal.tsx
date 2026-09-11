import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Car, 
  Users, 
  ShieldCheck, 
  Crown, 
  Lock,
  Smartphone
} from 'lucide-react';

interface ShareLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareLinksModal: React.FC<ShareLinksModalProps> = ({ isOpen, onClose }) => {
  const { lang, addNotification } = useTravel();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const domain = 'https://traveler.deterministicsolutionsdesign.com';

  const links = [
    {
      id: 'captains',
      titleAr: 'رابط الكباتن وملاك السيارات (تسجيل فقط — بدون صلاحيات)',
      titleEn: 'Captains & Car Owners Link (Registration Only)',
      badgeAr: 'مقيد ومحمي 🔒',
      badgeEn: 'Restricted & Secure',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700',
      url: `${domain}/?portal=captains`,
      descriptionAr: 'يقود السائق أو صاحب السيارة مباشرة إلى استمارة التسجيل المجاني وكراج السيارات دون أي صلاحية لرؤية ملفاتك أو جداولك الخاصة أو أدوات الإدارة.',
      descriptionEn: 'Takes the driver directly to free registration and vehicle garage without access to private files, itineraries, or admin controls.',
      icon: Car,
      whatsappText: `🚗 *السلام عليكم كباتن وملاك السيارات في اليمن*
تطبيق «المسافر» يتيح لك الآن تسجيل سيارتك مجاناً وإعلان رحلاتك بين المحافظات وملء مقاعد الراجع بكل سهولة:
✨ تسجيل مجاني 100% بدون أي عمولة أو وسيط.
📱 تواصل مباشر عبر الهاتف والواتساب مع الركاب.
💬 إدارة وفتح الرحلات حتى بدون إنترنت عبر الرسائل النصية SMS.
🛡️ تتبع وأمان عائلي مشفر لكل رحلة.

🔗 *رابط التسجيل وبوابة الكباتن المباشر:*
${domain}/?portal=captains`
    },
    {
      id: 'passenger',
      titleAr: 'رابط المسافرين (سوق وحجز الرحلات فقط)',
      titleEn: 'Passengers Link (Browse & Book Only)',
      badgeAr: 'عام للركاب 🛣️',
      badgeEn: 'Public Passengers',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
      url: `${domain}/?portal=passenger`,
      descriptionAr: 'يقود المسافر مباشرة إلى دليل رحلات الـ 22 محافظة وحجز المقاعد أو السيارة الكاملة والتتبع الحي دون أي صلاحيات إدارية.',
      descriptionEn: 'Takes passengers directly to browse and book seats or full cars across 22 governorates with live tracking.',
      icon: Users,
      whatsappText: `🛣️ *منصة المسافر (Traveler) — دليلك وحجزك لرحلات المحافظات اليمنية*
احجز مقعدك بالنفر أو سيارة صالون كاملة VIP بين الـ 22 محافظة يمنية:
✅ حجز مباشر مع الكابتن المعتمد بدون وسيط أو عمولة.
🛡️ كود تتبع عائلي مشفر لمتابعة خط سيرك أولاً بأول.
🚗 تحديثات حية للنقاط الأمنية والعقبات الجبلية.

🔗 *رابط حجز وتصفح الرحلات المباشر:*
${domain}/?portal=passenger`
    },
    {
      id: 'admin',
      titleAr: 'رابط الإدارة الكاملة (خاص بالمالك فقط)',
      titleEn: 'Super Admin Control Link (Owner Only)',
      badgeAr: 'سري وخاص 👑',
      badgeEn: 'Owner Only',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-700',
      url: `${domain}/?portal=admin`,
      descriptionAr: 'رابطك الخاص الذي يمنحك كامل الصلاحيات: لوحة تحكم الإدارة، حجب وتفعيل مكاتب النقل، متابعة الاشتراكات، والتحكم الشامل.',
      descriptionEn: 'Your private owner link with full access to administration, offices, subscriptions, and system controls.',
      icon: Crown,
      whatsappText: ''
    }
  ];

  const handleCopy = (id: string, url: string, titleAr: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 2500);
      addNotification({
        title: 'Link Copied',
        titleAr: `تم نسخ ${titleAr} 🔗`,
        message: 'Direct isolated link copied to clipboard.',
        messageAr: 'تم نسخ الرابط المباشر بنجاح. يمكنك الآن مشاركته بأمان.',
        type: 'general',
        priority: 'low',
        targetTab: 'overview'
      });
    });
  };

  const handleShareWhatsApp = (text: string) => {
    if (!text) return;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
                {lang === 'ar' ? 'روابط المنصة المباشرة والمخصصة حسب الصلاحية' : 'Official Direct App Links by Role'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {lang === 'ar' 
                  ? 'روابط مستقلة تضمن عدم وصول الكباتن أو الركاب لملفاتك أو إعداداتك الإدارية' 
                  : 'Isolated deep-links ensuring captains and passengers have zero access to private files'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links List */}
        <div className="p-5 overflow-y-auto space-y-4">
          {links.map(item => {
            const Icon = item.icon;
            const isCopied = copiedKey === item.id;
            return (
              <div 
                key={item.id}
                className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 hover:border-amber-400/50 transition space-y-3"
              >
                {/* Title & Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 flex items-center justify-center text-amber-600">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-stone-900 dark:text-white">
                      {lang === 'ar' ? item.titleAr : item.titleEn}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {lang === 'ar' ? item.badgeAr : item.badgeEn}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {lang === 'ar' ? item.descriptionAr : item.descriptionEn}
                </p>

                {/* URL Box */}
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                  <span className="text-xs font-mono text-amber-700 dark:text-amber-400 truncate flex-1 select-all px-1">
                    {item.url}
                  </span>

                  <button
                    onClick={() => handleCopy(item.id, item.url, item.titleAr)}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1 transition shrink-0"
                    title={lang === 'ar' ? 'نسخ الرابط' : 'Copy Link'}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">{lang === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'نسخ' : 'Copy'}</span>
                      </>
                    )}
                  </button>

                  {item.whatsappText && (
                    <button
                      onClick={() => handleShareWhatsApp(item.whatsappText)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition shrink-0"
                      title={lang === 'ar' ? 'مشاركة عبر واتساب' : 'Share on WhatsApp'}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                    </button>
                  )}

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                    title={lang === 'ar' ? 'تجربة فتح الرابط' : 'Test Open Link'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>{lang === 'ar' ? 'نظام العزل الأمني مفعّل تلقائياً عبر بارامترات الرابط' : 'Security isolation active via URL parameter routing'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold transition"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
