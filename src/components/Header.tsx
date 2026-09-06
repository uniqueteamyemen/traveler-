import React, { useState } from 'react';
import { useTravel, TabType } from '../context/TravelContext';
import { 
  Compass, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Ticket, 
  FileText, 
  Luggage, 
  BookOpen, 
  Plus, 
  Sun, 
  Moon, 
  Globe, 
  ChevronDown,
  ShieldCheck,
  Car,
  Users,
  AlertTriangle,
  User,
  Crown,
  Lock,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { NotificationBell } from './NotificationBell';

interface HeaderProps {
  onOpenNewTrip: () => void;
  onOpenAuth?: () => void;
  onOpenRoadAlerts?: () => void;
  onOpenLiveTracking?: () => void;
  onOpenSocialPoster?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenNewTrip, 
  onOpenAuth, 
  onOpenRoadAlerts,
  onOpenLiveTracking,
  onOpenSocialPoster
}) => {
  const { 
    trips, 
    activeTrip, 
    activeTripId, 
    setActiveTripId, 
    activeTab, 
    setActiveTab, 
    lang, 
    toggleLang, 
    theme, 
    toggleTheme,
    currentUser,
    userProfile,
    roadAlerts,
    setIsChatOpen,
    chatMessages
  } = useTravel();

  const [tripDropdownOpen, setTripDropdownOpen] = useState(false);

  const tabs: { id: TabType; labelEn: string; labelAr: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'overview', labelEn: 'Overview', labelAr: 'نظرة عامة', icon: Compass },
    { id: 'intercity_hub', labelEn: 'Intercity Trips', labelAr: 'سوق رحلات المحافظات', icon: Car, badge: '22 محافظة' },
    { id: 'driver_portal', labelEn: 'Captains & Car Owners', labelAr: 'بوابة الكباتن وملاك السيارات 🚗', icon: Users },
    { id: 'fixed_plan', labelEn: 'Fixed Plan & Safety', labelAr: 'خطة السير وأمان العائلة', icon: ShieldCheck },
    { id: 'map', labelEn: 'Yemen Map', labelAr: 'خريطة اليمن والمسار', icon: MapPin },
    { id: 'itinerary', labelEn: 'Itinerary', labelAr: 'الجدول الزمني', icon: Calendar },
    { id: 'bookings', labelEn: 'Bookings', labelAr: 'الحجوزات والتذاكر', icon: Ticket },
    { id: 'admin_control', labelEn: 'Admin Control', labelAr: 'لوحة الإدارة والاشتراكات', icon: Crown, badge: 'Super Admin' },
    { id: 'expenses', labelEn: 'Budget & Split', labelAr: 'المصاريف والقطة', icon: DollarSign },
    { id: 'documents', labelEn: 'Documents', labelAr: 'خزينة الوثائق', icon: FileText },
    { id: 'packing', labelEn: 'Packing List', labelAr: 'حقيبة السفر', icon: Luggage },
    { id: 'stories', labelEn: 'Beginning of Story', labelAr: 'بداية القصة', icon: BookOpen },
  ];

  const isAdmin = userProfile?.role === 'admin' || userProfile?.roles?.includes('admin');
  const visibleTabs = tabs.filter(tab => tab.id !== 'admin_control' || isAdmin);

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white flex items-center justify-center shadow-md ring-2 ring-amber-500/20">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-stone-900 dark:text-white leading-tight">
                    {lang === 'ar' ? 'المسافر' : 'TRAVELER'}
                  </h1>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/40">
                    {lang === 'ar' ? 'اليمن 🇾🇪' : 'Yemen'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 font-medium">
                  {lang === 'ar' ? 'سوق النقل بين المحافظات وبداية القصة' : 'Inter-Governorate Travel & Safety'}
                </p>
              </div>
            </div>

            <div className="hidden lg:block h-6 w-px bg-stone-300 dark:bg-stone-700 mx-2" />

            {/* Trip Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setTripDropdownOpen(!tripDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/60 transition shadow-xs"
              >
                <span className="max-w-[160px] truncate">
                  {lang === 'ar' ? (activeTrip?.titleAr || activeTrip?.title) : activeTrip?.title}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {tripDropdownOpen && (
                <div 
                  className="absolute start-0 mt-2 w-72 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setTripDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    {lang === 'ar' ? 'رحلاتك المجدولة' : 'Your Planned Journeys'}
                  </div>
                  {trips.map(trip => (
                    <button
                      key={trip.id}
                      onClick={() => {
                        setActiveTripId(trip.id);
                        setTripDropdownOpen(false);
                      }}
                      className={`w-full text-start px-3 py-2 text-xs flex items-center justify-between transition ${
                        trip.id === activeTripId 
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-semibold' 
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700/50'
                      }`}
                    >
                      <span className="truncate">{lang === 'ar' ? (trip.titleAr || trip.title) : trip.title}</span>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 shrink-0 ms-2">{trip.originGovernorate ? `${trip.originGovernorate} ${lang === 'ar' ? '←' : '➔'} ${trip.destinationGovernorate}` : trip.destination}</span>
                    </button>
                  ))}
                  <div className="border-t border-stone-100 dark:border-stone-700 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setTripDropdownOpen(false);
                        onOpenNewTrip();
                      }}
                      className="w-full text-start px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? '+ إضافة خط رحلة جديدة' : '+ Plan New Route'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Social Media Automator Button */}
            {onOpenSocialPoster && (
              <button
                onClick={onOpenSocialPoster}
                title={lang === 'ar' ? 'وحدة إنشاء المنشورات الدعائية المجانية' : 'Social Media Automator'}
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-400 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20 transition text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span className="hidden xl:inline text-[11px] font-black">{lang === 'ar' ? 'نشر دعائي 🎁' : 'Auto-Poster 🎁'}</span>
              </button>
            )}

            {/* Encrypted Family Live Tracking Button */}
            {onOpenLiveTracking && (
              <button
                onClick={onOpenLiveTracking}
                title={lang === 'ar' ? 'تتبع رحلة عائلتك بالكود المشفر' : 'Encrypted Family Live Tracking'}
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-stone-900 dark:bg-stone-800 text-amber-300 hover:bg-stone-800 border border-stone-700 shadow-xs transition text-xs font-bold flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline text-[11px] font-mono">{lang === 'ar' ? 'تتبع بالكود 🔒' : 'Live Track 🔒'}</span>
              </button>
            )}

            {/* Road Passes & Mountain Radar Button */}
            {onOpenRoadAlerts && (
              <button
                onClick={onOpenRoadAlerts}
                title={lang === 'ar' ? 'رادار حالة الطرق والعقبات الجبلية المباشر' : 'Live Highway Radar'}
                className="p-2 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 animate-pulse" />
                <span className="hidden lg:inline text-[11px] font-extrabold">{lang === 'ar' ? 'رادار الطرق' : 'Radar'}</span>
              </button>
            )}

            {/* Free In-App Support Chat & FAQ Button */}
            <button
              onClick={() => setIsChatOpen(true)}
              title={lang === 'ar' ? 'المحادثة المباشرة مع الإدارة والأسئلة الشائعة مجاناً' : 'Free Live Support & FAQ'}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition text-xs font-bold flex items-center gap-1.5 shadow-xs relative"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden lg:inline text-[11px] font-extrabold">{lang === 'ar' ? 'محادثة ودعم' : 'Support'}</span>
              {chatMessages.filter(m => !m.readByAdmin && !m.isFromAdmin).length > 0 && (
                <span className="absolute -top-1 -end-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              )}
            </button>

            {/* Real-time Notification Bell */}
            <NotificationBell />

            {/* User Account / Auth Button */}
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition shadow-xs ${
                  currentUser
                    ? 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                }`}
                title={lang === 'ar' ? 'بوابة الحسابات والمصادقة المركزية' : 'Account & Role'}
              >
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="user" className="w-4 h-4 rounded-full" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className="hidden md:inline max-w-[90px] truncate">
                  {currentUser ? (userProfile?.displayName?.split(' ')[0] || 'حسابي') : (lang === 'ar' ? 'دخول' : 'Sign In')}
                </span>
              </button>
            )}

            <button
              onClick={onOpenNewTrip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'تخطيط رحلة' : 'New Journey'}</span>
            </button>

            {/* Language Switch */}
            <button
              onClick={toggleLang}
              aria-label="Toggle language"
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700/60 transition text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* Theme Switch */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700/60 transition shadow-xs"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition shrink-0 ${
                  isActive
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 bg-stone-100/70 dark:bg-stone-800/70 hover:bg-stone-200 dark:hover:bg-stone-700 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-600 dark:text-stone-300'}`} />
                <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-amber-800 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
