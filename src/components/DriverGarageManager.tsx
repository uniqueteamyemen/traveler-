import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { DriverVehicle } from '../types/travel';
import { 
  Car, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  Layers, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

interface DriverGarageManagerProps {
  onSelectVehicleForTrip?: (vehicle: DriverVehicle) => void;
}

export const DriverGarageManager: React.FC<DriverGarageManagerProps> = ({ onSelectVehicleForTrip }) => {
  const { 
    driverVehicles, 
    activeDriverVehicleId, 
    setActiveDriverVehicleId, 
    addDriverVehicle, 
    removeDriverVehicle, 
    lang 
  } = useTravel();

  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [model, setModel] = useState('تويوتا شاص / لاندكروزر صالون');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<DriverVehicle['vehicleType']>('suv_4x4');
  const [year, setYear] = useState(2024);
  const [totalSeats, setTotalSeats] = useState(4);
  const [color, setColor] = useState('أبيض');

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim() || !plateNumber.trim()) return;

    addDriverVehicle({
      model,
      plateNumber,
      vehicleType,
      year: Number(year),
      totalSeats: Number(totalSeats),
      color,
      isPrimary: driverVehicles.length === 0
    });

    setIsAddingVehicle(false);
    setModel('تويوتا شاص / لاندكروزر صالون');
    setPlateNumber('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Garage Welcome & Policy Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-stone-900/40 p-5 rounded-3xl border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-black text-sm">
            <Car className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>كراج سيارات الكابتن (مجاني تماماً 100%)</span>
          </div>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
            يمكنك تسجيل أكثر من سيارة (مثلاً: لاندكروزر صالون للخطوط الجبلية، وستاريا أو باص صغير لرحلات العائلات)، والتبديل بينها بنقرة واحدة عند فتح أي رحلة بدون الحاجة لإعادة كتابة مواصفات السيارة ورقم اللوحة في كل مرة.
          </p>
        </div>

        <button
          onClick={() => setIsAddingVehicle(true)}
          className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black flex items-center justify-center gap-2 shrink-0 shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة سيارة جديدة للكراج</span>
        </button>
      </div>

      {/* Add Vehicle Modal / Inline Form */}
      {isAddingVehicle && (
        <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 border-2 border-amber-500/40 shadow-xl space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700">
            <h4 className="text-sm font-black text-stone-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-500" />
              <span>إضافة سيارة جديدة إلى كراجك الخاص</span>
            </h4>
            <button
              onClick={() => setIsAddingVehicle(false)}
              className="text-stone-400 hover:text-stone-600 text-xs font-bold"
            >
              إلغاء
            </button>
          </div>

          <form onSubmit={handleCreateVehicle} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  موديل ونوع السيارة:
                </label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="مثال: تويوتا لاندكروزر صالون V8"
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  رقم لوحة السيارة (هام للمطابقة والأمان):
                </label>
                <input
                  type="text"
                  required
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="مثال: 12455 / صنعاء أو عدن 7890"
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  فئة المركبة:
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as any)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                >
                  <option value="suv_4x4">جيب صالون 4x4 دفع رباعي</option>
                  <option value="microbus">باص صغير (ستاريا / H1 / هايس)</option>
                  <option value="sedan">صالون سيدان عائلي</option>
                  <option value="vip_limousine">ليموزين VIP خاص</option>
                  <option value="large_bus">باص نقل كبير</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  عدد المقاعد المتاحة للركاب:
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  سنة الصنع:
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  لون السيارة:
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="مثال: أبيض لؤلؤي"
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingVehicle(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md"
              >
                حفظ السيارة في الكراج
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {driverVehicles.map((vehicle) => {
          const isActive = vehicle.id === activeDriverVehicleId;

          return (
            <div
              key={vehicle.id}
              className={`rounded-3xl p-5 border-2 transition relative space-y-4 ${
                isActive
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-500 shadow-md'
                  : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-amber-400/60'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${
                    isActive 
                      ? 'bg-amber-500 text-stone-950 shadow-md' 
                      : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                  }`}>
                    <Car className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-stone-900 dark:text-white">
                        {vehicle.model}
                      </h4>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-stone-950 text-[10px] font-black flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>المركبة النشطة حالياً</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5 font-mono">
                      <span>لوحة: <strong>{vehicle.plateNumber}</strong></span>
                      <span>•</span>
                      <span>سنة: {vehicle.year}</span>
                    </div>
                  </div>
                </div>

                {driverVehicles.length > 1 && (
                  <button
                    onClick={() => removeDriverVehicle(vehicle.id)}
                    className="text-stone-400 hover:text-red-500 p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                    title="حذف السيارة من الكراج"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Specs Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold">
                  {vehicle.totalSeats} مقاعد ركاب
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold">
                  اللون: {vehicle.color || 'أبيض'}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300/40">
                  فحص ميكانيكي مجاز
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-700/60">
                {!isActive ? (
                  <button
                    onClick={() => setActiveDriverVehicleId(vehicle.id)}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-700 hover:bg-amber-500 hover:text-stone-950 text-stone-800 dark:text-stone-200 text-xs font-bold transition"
                  >
                    تعيين كسيارة رئيسية
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>جاهزة لفتح الرحلات</span>
                  </span>
                )}

                {onSelectVehicleForTrip && (
                  <button
                    onClick={() => onSelectVehicleForTrip(vehicle)}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition active:scale-95"
                  >
                    <span>استخدام في رحلة الآن</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
