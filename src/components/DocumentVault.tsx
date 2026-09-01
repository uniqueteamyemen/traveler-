import React from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  Plus, 
  FileText, 
  Trash2, 
  ShieldCheck, 
  CreditCard, 
  Stamp, 
  Calendar, 
  User, 
  AlertTriangle 
} from 'lucide-react';
import { TravelDocument } from '../types/travel';

interface DocumentVaultProps {
  onOpenNewDocument: () => void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({ onOpenNewDocument }) => {
  const { activeTrip, lang, deleteDocument } = useTravel();

  if (!activeTrip) return null;

  const documents = activeTrip.documents || [];

  const getDocIcon = (type: TravelDocument['type']) => {
    switch (type) {
      case 'passport': return <Stamp className="w-5 h-5 text-amber-500" />;
      case 'travel_permit': return <ShieldCheck className="w-5 h-5 text-blue-500" />;
      case 'insurance': return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case 'id_card': return <CreditCard className="w-5 h-5 text-purple-500" />;
      case 'car_license': return <CreditCard className="w-5 h-5 text-indigo-500" />;
      default: return <FileText className="w-5 h-5 text-stone-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">
            {lang === 'ar' ? 'خزينة وثائق ومستندات السفر' : 'Travel Document & Identity Vault'}
          </h2>
          <p className="text-xs text-stone-700 dark:text-stone-300 mt-0.5">
            {lang === 'ar' ? 'حفظ وإدارة جوازات السفر، التأشيرات، بطاقات التأمين، وتواريخ الانتهاء' : 'Store passports, visas, insurance policies, and expiry notifications'}
          </p>
        </div>

        <button
          onClick={onOpenNewDocument}
          className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? '+ إضافة وثيقة' : '+ Add Document'}</span>
        </button>
      </div>

      {/* Security Tip Box */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>{lang === 'ar' ? 'تنبيه أمان السفر:' : 'Travel Security Notice:'}</strong>{' '}
          {lang === 'ar' 
            ? 'احرص دائماً على الاحتفاظ بنسخ رقمية وصور ورقية من جواز سفرك وتأشيرتك في مكان آمن منفصل أثناء التنقل.'
            : 'Always maintain offline digital copies and printed backup sets of your passport and visas in a separate secure bag.'}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs hover:border-amber-500/40 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800">
                    {getDocIcon(doc.type)}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
                      {doc.type}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                      {doc.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => deleteDocument(activeTrip.id, doc.id)}
                  className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 transition"
                  title="Delete document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3.5 space-y-2 text-xs text-stone-600 dark:text-stone-300">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{doc.holderName}</span>
                </div>

                {doc.documentNumber && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="font-mono text-stone-700 dark:text-stone-300">No: {doc.documentNumber}</span>
                  </div>
                )}

                {doc.expiryDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{lang === 'ar' ? 'تاريخ الانتهاء:' : 'Expiry:'} <strong className="text-stone-800 dark:text-stone-200">{doc.expiryDate}</strong></span>
                  </div>
                )}

                {doc.notes && (
                  <div className="pt-1 text-[11px] text-stone-500 dark:text-stone-400 italic">
                    {doc.notes}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {lang === 'ar' ? 'محفوظ ومشفر' : 'Verified'}
              </span>
            </div>
          </div>
        ))}

        {documents.length === 0 && (
          <div className="col-span-full text-center py-12 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
            <p className="text-xs text-stone-500">
              {lang === 'ar' ? 'لم يتم حفظ أي وثائق في الخزينة بعد' : 'No documents saved yet'}
            </p>
            <button
              onClick={onOpenNewDocument}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إضافة وثيقة السفر الأولى' : 'Add First Document'}</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
