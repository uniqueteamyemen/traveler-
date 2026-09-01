import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { 
  User, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  Car, 
  Users, 
  Building2,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../../types/travel';

export const AuthControlModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    userProfile, 
    loginWithGoogle, 
    loginGuest, 
    logout, 
    updateUserRole, 
    lang, 
    isRTL 
  } = useTravel();

  const [selectedRole, setSelectedRole] = useState<UserRole>(userProfile?.role || 'passenger');
  const [vehicleModel, setVehicleModel] = useState(userProfile?.vehicleModel || '');
  const [plateNumber, setPlateNumber] = useState(userProfile?.plateNumber || '');
  const [governorate, setGovernorate] = useState(userProfile?.governorate || 'عدن');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async (role: UserRole) => {
    try {
      setLoading(true);
      await loginGuest(role);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRole = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      await updateUserRole(selectedRole, {
        vehicleModel,
        plateNumber,
        governorate,
        isDriverVerified: selectedRole === 'driver'
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black">
                {lang === 'ar' ? 'بوابة الحسابات والمصادقة المركزية' : 'Traveler Central Cloud Auth'}
              </h3>
              <p className="text-xs text-amber-100">
                {lang === 'ar' ? 'سحابة سَفَر لمزامنة السائقين، الركاب، والأهل' : 'Real-time multi-user synchronization'}
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

        <div className="p-6 space-y-5">
          {currentUser ? (
            /* Logged in state & Profile Management */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex items-center gap-3.5">
                <img 
                  src={currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white truncate">
                      {userProfile?.displayName || currentUser.displayName || 'مستخدم مسجل'}
                    </h4>
                    {userProfile?.isDriverVerified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                    {currentUser.email || (lang === 'ar' ? 'جلسة ضيف متصلة بالسحابة' : 'Cloud Guest Session')}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    {userProfile?.role === 'driver' 
                      ? (lang === 'ar' ? 'كابتن / سائق معتمد' : 'Verified Captain') 
                      : userProfile?.role === 'transport_company'
                      ? (lang === 'ar' ? 'شركة نقل بري' : 'Transport Operator')
                      : (lang === 'ar' ? 'مسافر / راكب' : 'Passenger')}
                  </span>
                </div>
              </div>

              {/* Role Switcher */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  {lang === 'ar' ? 'تحديد دورك في المنصة:' : 'Choose your platform role:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('passenger')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      selectedRole === 'passenger'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300 font-bold ring-2 ring-amber-500/20'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-xs">{lang === 'ar' ? 'مسافر' : 'Passenger'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('driver')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      selectedRole === 'driver'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300 font-bold ring-2 ring-amber-500/20'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    <span className="text-xs">{lang === 'ar' ? 'كابتن / سائق' : 'Driver'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('transport_company')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      selectedRole === 'transport_company'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300 font-bold ring-2 ring-amber-500/20'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="text-xs">{lang === 'ar' ? 'شركة نقل' : 'Company'}</span>
                  </button>
                </div>
              </div>

              {selectedRole === 'driver' && (
                <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-2.5">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-800 dark:text-amber-300">
                    <Car className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'بيانات مركبة الكابتن:' : 'Vehicle Details:'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input 
                      type="text" 
                      placeholder={lang === 'ar' ? 'نوع المركبة (تويوتا برادو..)' : 'Vehicle Model'}
                      value={vehicleModel}
                      onChange={e => setVehicleModel(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                    />
                    <input 
                      type="text" 
                      placeholder={lang === 'ar' ? 'رقم اللوحة / الفرزة' : 'Plate Number'}
                      value={plateNumber}
                      onChange={e => setPlateNumber(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveRole}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loading ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ وتحديث الدور بالسحابة' : 'Save & Sync Role')}</span>
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="px-3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-stone-600 dark:text-stone-300 text-xs font-bold transition flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'خروج' : 'Logout'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Login Options */
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {lang === 'ar' 
                    ? 'قم بتسجيل الدخول لمزامنة حجوزاتك، استقبال إشعارات السائقين لحظياً، وحفظ خطط السفر سحابياً.' 
                    : 'Sign in to synchronize real-time bookings, driver notifications, and cloud itineraries.'}
                </p>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2.5 active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{lang === 'ar' ? 'الدخول السريع بحساب Google' : 'Continue with Google'}</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-stone-200 dark:border-stone-800"></div>
                <span className="flex-shrink mx-3 text-[11px] text-stone-400 font-semibold">
                  {lang === 'ar' ? 'أو الدخول التجريبي كـ' : 'Or quick trial as'}
                </span>
                <div className="flex-grow border-t border-stone-200 dark:border-stone-800"></div>
              </div>

              {/* Guest Fast Logins */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleGuestLogin('passenger')}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'ar' ? 'دخول كمسافر' : 'As Passenger'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGuestLogin('driver')}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Car className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'ar' ? 'دخول ككابتن' : 'As Driver'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
