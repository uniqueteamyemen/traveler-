import React from 'react';
import { ShieldCheck, Phone, MessageSquare, Compass, Info, CheckCircle2, Sparkles, X } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

interface AboutPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutPlatformModal: React.FC<AboutPlatformModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useTravel();

  if (!isOpen) return null;

  const supportPhone = '+967777000111';
  const supportWhatsapp = '967777000111';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header with Yemen Emerald theme */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Compass className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  {lang === 'ar' ? 'عن منصة المسافر' : 'About Traveler Platform'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                  v1.0.12
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium">
                {lang === 'ar' ? 'الوسيط التقني الموثوق لرحلات اليمن' : 'Yemen’s Premier Intercity Transit Gateway'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Card 1: Independent Intermediary Role */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Compass className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
              {lang === 'ar' 
                ? 'المسافر منصة رقمية مستقلة تعمل كوسيط تقني يربط بين الركاب والسائقين ومكاتب النقل في اليمن. نحن لا نمتلك أي مركبات ولا ندير عمليات النقل الميدانية مباشرة، بل نوفر البيئة الذكية الآمنة التي تجمع الطرفين.' 
                : 'Traveler is an independent digital platform operating as a tech intermediary connecting passengers, drivers, and transport offices across Yemen.'}
            </p>
          </div>

          {/* Card 2: Mission & Automation */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
              {lang === 'ar' 
                ? 'نطمح من خلال تطبيقنا إلى أتمتة عملية البحث وتنسيق الحجوزات، ليتمكن الراكب من العثور على رحلته المناسبة، والسائق من تنظيم مساره وملء مقاعد الراجع، باستقلالية تامة وحرية في الاختيار.' 
                : 'We aim to automate search and booking coordination, empowering travelers to find ideal trips and drivers to fill return seats with full flexibility.'}
            </p>
          </div>

          {/* Card 3: Safety & Scope */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
              {lang === 'ar' 
                ? 'يقتصر دورنا على توفير أداة تقنية آمنة تضمن شفافية الاتفاق وتسهل التواصل المباشر بين المستخدمين، مع دعم بروتوكول الأمان العائلي والتحقق من الهويات ورخص القيادة المعتمدة.' 
                : 'Our role focuses on providing a secure digital tool ensuring agreement transparency, direct communication, and family safety tracking.'}
            </p>
          </div>

          {/* Support Buttons: Call & WhatsApp */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`tel:${supportPhone}`}
              className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>{lang === 'ar' ? 'اتصال هاتفي' : 'Phone Call'}</span>
            </a>

            <a
              href={`https://wa.me/${supportWhatsapp}?text=${encodeURIComponent('السلام عليكم، استفسار بخصوص خدمات وحجوزات تطبيق المسافر (Traveler)')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تواصل واتساب' : 'WhatsApp Support'}</span>
            </a>
          </div>

          {/* Footer & Credits */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 text-center space-y-1.5">
            <div className="text-xs font-black text-emerald-700 dark:text-emerald-400">
              {lang === 'ar' ? 'تطوير وإدارة: فريق تطبيق المسافر (Traveler)' : 'Developed & Managed by: Traveler Team'}
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
              جميع الحقوق محفوظة © 2026
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold mt-1">
              <span>صُنع بكل فخر في اليمن</span>
              <span>🇾🇪</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
