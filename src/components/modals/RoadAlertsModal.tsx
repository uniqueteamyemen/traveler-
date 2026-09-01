import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { 
  AlertTriangle, 
  CheckCircle2, 
  CloudRain, 
  MapPin, 
  ShieldAlert
} from 'lucide-react';
import { RoadPassAlert } from '../../types/travel';

export const RoadAlertsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { roadAlerts, updateRoadAlertStatus, lang, isRTL } = useTravel();
  const [selectedPass, setSelectedPass] = useState<RoadPassAlert | null>(null);
  const [newStatus, setNewStatus] = useState<RoadPassAlert['status']>('open');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen) return null;

  const getStatusBadge = (status: RoadPassAlert['status']) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'سالك ومفتوح' : 'Open'}</span>
          </span>
        );
      case 'fog_rain':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            <CloudRain className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'ضباب وأمطار' : 'Fog & Rain'}</span>
          </span>
        );
      case 'cautious':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'سالك بحذر' : 'Caution'}</span>
          </span>
        );
      case 'blocked_maintenance':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'مغلق / صيانة' : 'Blocked / Repairs'}</span>
          </span>
        );
    }
  };

  const handleUpdate = async () => {
    if (!selectedPass) return;
    try {
      setIsUpdating(true);
      const labelMap: Record<RoadPassAlert['status'], string> = {
        open: lang === 'ar' ? 'مفتوح وسالك تماماً' : 'Completely Open',
        fog_rain: lang === 'ar' ? 'ضباب كثيف وأمطار - القيادة بحذر' : 'Heavy Fog & Rain',
        cautious: lang === 'ar' ? 'سالك بحذر مع بطء حركة الشاحنات' : 'Caution Advised',
        blocked_maintenance: lang === 'ar' ? 'إغلاق مؤقت لأعمال الصيانة' : 'Temporarily Blocked'
      };

      await updateRoadAlertStatus({
        ...selectedPass,
        status: newStatus,
        statusLabelAr: labelMap[newStatus],
        reportedAt: lang === 'ar' ? 'محدث للتو عبر الكباتن' : 'Updated just now by Captains',
        descriptionAr: statusNote || selectedPass.descriptionAr
      });
      setSelectedPass(null);
      setStatusNote('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-600 via-amber-700 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-black">
                {lang === 'ar' ? 'رادار حالة الطرق والعقبات الجبلية المباشر' : 'Live Highway & Mountain Pass Radar'}
              </h3>
              <p className="text-xs text-amber-100">
                {lang === 'ar' ? 'تحديثات حية من شبكة الكباتن المعتمدين وغرفة الطوارئ' : 'Real-time road safety from verified drivers'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition"
          >
            ✕
          </button>
        </div>

        {/* Passes List */}
        <div className="p-5 overflow-y-auto space-y-3 divide-y divide-stone-100 dark:divide-stone-800 flex-1">
          {roadAlerts.map((pass: RoadPassAlert) => (
            <div 
              key={pass.id}
              className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                    {lang === 'ar' ? pass.passNameAr : pass.passNameEn}
                  </h4>
                  {getStatusBadge(pass.status)}
                </div>

                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{pass.route} ({pass.governorate})</span>
                </p>

                <p className="text-xs text-stone-600 dark:text-stone-300">
                  {pass.descriptionAr}
                </p>

                <span className="text-[10px] text-stone-400 block pt-0.5">
                  ⏱ {pass.reportedAt}
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedPass(pass);
                  setNewStatus(pass.status);
                  setStatusNote(pass.descriptionAr);
                }}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-amber-50 hover:text-amber-700 dark:bg-stone-800 dark:hover:bg-amber-950/40 text-stone-700 dark:text-stone-300 text-xs font-bold transition self-start sm:self-center shrink-0 border border-stone-200 dark:border-stone-700"
              >
                {lang === 'ar' ? '✏️ تحديث الحالة' : 'Update Status'}
              </button>
            </div>
          ))}
        </div>

        {/* Update Form Modal Drawer if selected */}
        {selectedPass && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-t border-amber-200 dark:border-amber-800 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                {lang === 'ar' ? `تحديث حالة: ${selectedPass.passNameAr}` : `Update: ${selectedPass.passNameEn}`}
              </h5>
              <button 
                onClick={() => setSelectedPass(null)}
                className="text-xs text-stone-500 hover:text-stone-800"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'open', label: lang === 'ar' ? 'سالك ومفتوح' : 'Open' },
                { id: 'fog_rain', label: lang === 'ar' ? 'ضباب / أمطار' : 'Fog & Rain' },
                { id: 'cautious', label: lang === 'ar' ? 'سالك بحذر' : 'Caution' },
                { id: 'blocked_maintenance', label: lang === 'ar' ? 'صيانة / إغلاق' : 'Blocked' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setNewStatus(opt.id as RoadPassAlert['status'])}
                  className={`px-2 py-1.5 rounded-xl text-xs font-bold border transition ${
                    newStatus === opt.id 
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <input 
              type="text"
              placeholder={lang === 'ar' ? 'ملاحظة أو تفاصيل الحالة الميدانية...' : 'Condition notes...'}
              value={statusNote}
              onChange={e => setStatusNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-white"
            />

            <div className="flex justify-end">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition"
              >
                {isUpdating ? (lang === 'ar' ? 'جاري البث للسحابة...' : 'Syncing...') : (lang === 'ar' ? 'بث التحديث لجميع المسافرين' : 'Broadcast to Cloud')}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-100 dark:border-stone-800 text-center">
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            {lang === 'ar' ? 'تُربط بيانات العقبات مباشرة بغرفة الطوارئ وتنبيهات المسافرين الفورية في خطة السير.' : 'Road passes are synchronized with Firestore and instant travel alerts.'}
          </p>
        </div>
      </div>
    </div>
  );
};
