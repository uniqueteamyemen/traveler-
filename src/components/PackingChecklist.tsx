import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  Plus, 
  Luggage, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Sparkles, 
  ShieldAlert, 
  Shirt, 
  Smartphone, 
  HeartPulse, 
  Smile, 
  Layers 
} from 'lucide-react';
import { PackingItem } from '../types/travel';

export const PackingChecklist: React.FC = () => {
  const { 
    activeTrip, 
    lang, 
    togglePackingItem, 
    deletePackingItem, 
    addPackingItem, 
    generateSmartPacking 
  } = useTravel();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PackingItem['category']>('essentials');
  const [newItemQty, setNewItemQty] = useState(1);

  if (!activeTrip) return null;

  const packingList = activeTrip.packingList || [];
  const totalItems = packingList.length;
  const packedCount = packingList.filter(p => p.isPacked).length;
  const progressPercent = totalItems > 0 ? Math.round((packedCount / totalItems) * 100) : 0;

  const filteredItems = activeCategory === 'all' 
    ? packingList 
    : packingList.filter(p => p.category === activeCategory);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addPackingItem(activeTrip.id, {
      name: newItemName.trim(),
      category: newItemCategory,
      isPacked: false,
      quantity: newItemQty
    });

    setNewItemName('');
    setNewItemQty(1);
  };

  const getCategoryIcon = (cat: PackingItem['category']) => {
    switch (cat) {
      case 'essentials': return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      case 'clothing': return <Shirt className="w-4 h-4 text-blue-500" />;
      case 'electronics': return <Smartphone className="w-4 h-4 text-purple-500" />;
      case 'toiletries': return <Smile className="w-4 h-4 text-teal-500" />;
      case 'medicine': return <HeartPulse className="w-4 h-4 text-rose-500" />;
      default: return <Luggage className="w-4 h-4 text-stone-500" />;
    }
  };

  const categories: { id: string; labelEn: string; labelAr: string }[] = [
    { id: 'all', labelEn: 'All Items', labelAr: 'الكل' },
    { id: 'essentials', labelEn: 'Essentials', labelAr: 'الأساسيات' },
    { id: 'clothing', labelEn: 'Clothing', labelAr: 'الملابس' },
    { id: 'electronics', labelEn: 'Electronics', labelAr: 'الإلكترونيات' },
    { id: 'toiletries', labelEn: 'Toiletries', labelAr: 'العناية الشخصية' },
    { id: 'medicine', labelEn: 'Medicine & Health', labelAr: 'الصيدلية والأدوية' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">
            {lang === 'ar' ? 'قائمة تجهيز الحقيبة الذكية' : 'Smart Packing Checklist'}
          </h2>
          <p className="text-xs text-stone-700 dark:text-stone-300 mt-0.5">
            {lang === 'ar' ? 'تأكد من عدم نسيان أي مستلزمات ضرورية لرحلتك' : 'Organize clothes, tech gear, medications, and essentials'}
          </p>
        </div>

        <button
          onClick={() => generateSmartPacking(activeTrip.id)}
          className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'توليد قائمة المستلزمات الذكية' : 'Auto-Generate Essentials'}</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Luggage className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-stone-700 dark:text-stone-300 font-medium">
              {lang === 'ar' ? 'حالة تجهيز الأمتعة' : 'Packing Readiness'}
            </div>
            <div className="text-lg font-bold text-stone-900 dark:text-white">
              {packedCount} {lang === 'ar' ? 'من أصل' : 'of'} {totalItems} {lang === 'ar' ? 'عناصر تم تجهيزها' : 'items packed'}
            </div>
          </div>
        </div>

        <div className="w-full sm:w-64 space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
            <span>{progressPercent}%</span>
            <span>{totalItems - packedCount} {lang === 'ar' ? 'متبقي' : 'left'}</span>
          </div>
          <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-sky-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAddItem} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder={lang === 'ar' ? 'أضف عنصراً جديداً إلى الحقيبة (مثل: نظارة شمسية، حذاء رياضي)...' : 'Add new packing item (e.g., portable charger, sunscreen)...'}
          className="flex-1 w-full px-3.5 py-2 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
        />

        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value as PackingItem['category'])}
          className="px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200"
        >
          <option value="essentials">{lang === 'ar' ? 'الأساسيات' : 'Essentials'}</option>
          <option value="clothing">{lang === 'ar' ? 'الملابس' : 'Clothing'}</option>
          <option value="electronics">{lang === 'ar' ? 'الإلكترونيات' : 'Electronics'}</option>
          <option value="toiletries">{lang === 'ar' ? 'العناية الشخصية' : 'Toiletries'}</option>
          <option value="medicine">{lang === 'ar' ? 'الأدوية' : 'Medicine'}</option>
          <option value="gear">{lang === 'ar' ? 'معدات أخرى' : 'Other Gear'}</option>
        </select>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <input
            type="number"
            min="1"
            max="99"
            value={newItemQty}
            onChange={(e) => setNewItemQty(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 px-2 py-2 text-center rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white"
          />

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إضافة' : 'Add'}</span>
          </button>
        </div>
      </form>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeCategory === c.id
                ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
                : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            {lang === 'ar' ? c.labelAr : c.labelEn}
          </button>
        ))}
      </div>

      {/* Checklist Items */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800 overflow-hidden shadow-xs">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 flex items-center justify-between gap-3 transition ${
              item.isPacked ? 'bg-stone-50/50 dark:bg-stone-800/20' : 'hover:bg-stone-50/50 dark:hover:bg-stone-850'
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => togglePackingItem(activeTrip.id, item.id)}
                className="p-1 text-stone-400 hover:text-sky-600 transition shrink-0"
              >
                {item.isPacked ? (
                  <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                ) : (
                  <Circle className="w-5 h-5 text-stone-300 dark:text-stone-600 hover:text-sky-600" />
                )}
              </button>

              <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 shrink-0">
                {getCategoryIcon(item.category)}
              </div>

              <div className="truncate">
                <span className={`text-xs font-semibold text-stone-900 dark:text-white ${item.isPacked ? 'line-through text-stone-400 dark:text-stone-500' : ''}`}>
                  {lang === 'ar' ? (item.nameAr || item.name) : item.name}
                </span>
                {item.quantity > 1 && (
                  <span className="ms-2 text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono">
                    x{item.quantity}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => deletePackingItem(activeTrip.id, item.id)}
              className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 transition shrink-0"
              title="Delete item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-10 text-xs text-stone-700 dark:text-stone-300">
            {lang === 'ar' ? 'لا توجد عناصر في هذا التصنيف' : 'No items in this category'}
          </div>
        )}
      </div>

    </div>
  );
};
