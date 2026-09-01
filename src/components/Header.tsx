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
  Users
} from 'lucide-react';
import { NotificationBell } from './NotificationBell';

interface HeaderProps {
  onOpenNewTrip: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewTrip }) => {
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
    toggleTheme 
  } = useTravel();

  const [tripDropdownOpen, setTripDropdownOpen] = useState(false);

  const tabs: { id: TabType; labelEn: string; labelAr: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'overview', labelEn: 'Overview', labelAr: 'نظرة عامة', icon: Compass },
    { id: 'intercity_hub', labelEn: 'Intercity Trips', labelAr: 'سوق رحلات المحافظات', icon: Car, badge: '22 محافظة' },
    { id: 'fixed_plan', labelEn: 'Fixed Plan & Safety', labelAr: 'خطة السير وأمان العائلة', icon: ShieldCheck },
    { id: 'map', labelEn: 'Yemen Map', labelAr: 'خريطة اليمن والمسار', icon: MapPin },
    { id: 'itinerary', labelEn: 'Itinerary', labelAr: 'الجدول الزمني', icon: Calendar },
    { id: 'bookings', labelEn: 'Bookings', labelAr: 'الحجوزات والتذاكر', icon: Ticket },
    { id: 'driver_portal', labelEn: 'Driver & Fleet Portal', labelAr: 'بوابة السائقين والشركات', icon: Users },
    { id: 'expenses', labelEn: 'Budget & Split', labelAr: 'المصاريف والقطة', icon: DollarSign },
    { id: 'documents', labelEn: 'Documents', labelAr: 'خزينة الوثائق', icon: FileText },
    { id: 'packing', labelEn: 'Packing List', labelAr: 'حقيبة السفر', icon: Luggage },
    { id: 'stories', labelEn: 'Beginning of Story', labelAr: 'بداية القصة', icon: BookOpen },
  ];

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
                    {lang === 'ar' ? 'سَفَر' : 'TRAVELER'}
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
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 shrink-0 ms-2">{trip.originGovernorate ? `${trip.originGovernorate} ➔ ${trip.destinationGovernorate}` : trip.destination}</span>
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
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Real-time Notification Bell */}
            <NotificationBell />

            <button
              onClick={onOpenNewTrip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تخطيط رحلة' : 'New Journey'}</span>
            </button>

            {/* Language Switch */}
            <button
              onClick={toggleLang}
              aria-label="Toggle language"
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700/60 transition text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* Theme Switch */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700/60 transition shadow-xs"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {tabs.map(tab => {
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
