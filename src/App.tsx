import React, { useState, useEffect } from 'react';
import { TravelProvider, useTravel } from './context/TravelContext';
import { Header } from './components/Header';
import { TripOverview } from './components/TripOverview';
import { IntercityHub } from './components/IntercityHub';
import { FixedPlanSafety } from './components/FixedPlanSafety';
import { DriverPortal } from './components/DriverPortal';
import { AdminControlPortal } from './components/AdminControlPortal';
import { ItineraryView } from './components/ItineraryView';
import { RouteMap } from './components/RouteMap';
import { BookingsView } from './components/BookingsView';
import { ExpensesTracker } from './components/ExpensesTracker';
import { DocumentVault } from './components/DocumentVault';
import { PackingChecklist } from './components/PackingChecklist';
import { StoryJournal } from './components/StoryJournal';

import { NewTripModal } from './components/modals/NewTripModal';
import { NewActivityModal } from './components/modals/NewActivityModal';
import { NewExpenseModal } from './components/modals/NewExpenseModal';
import { NewBookingModal } from './components/modals/NewBookingModal';
import { NewDocumentModal } from './components/modals/NewDocumentModal';
import { NewStoryModal } from './components/modals/NewStoryModal';
import { LiveNotificationToast } from './components/LiveNotificationToast';
import { AuthControlModal } from './components/modals/AuthControlModal';
import { RoadAlertsModal } from './components/modals/RoadAlertsModal';
import { FamilyLiveTrackingModal } from './components/modals/FamilyLiveTrackingModal';
import { InAppSupportChatModal } from './components/modals/InAppSupportChatModal';
import { MessageSquare } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    activeTrip, 
    lang, 
    setIsChatOpen, 
    chatMessages, 
    setActiveTab,
    portalMode,
    setPortalMode
  } = useTravel();

  // Handle URL Deep-Linking: ?portal=captains or ?portal=passenger or hashes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const portal = (params.get('portal') || params.get('role') || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();

      if (
        portal === 'captains' || 
        portal === 'captain' || 
        portal === 'driver' || 
        portal === 'owners' || 
        portal === 'register-captain' || 
        params.get('register') === 'captain' || 
        hash === '#captain' || 
        hash === '#driver'
      ) {
        setPortalMode('captains');
        setActiveTab('driver_portal');
      } else if (
        portal === 'passenger' || 
        portal === 'passengers' || 
        portal === 'traveler' || 
        portal === 'trips' || 
        hash === '#trips' || 
        hash === '#passenger'
      ) {
        setPortalMode('passenger');
        setActiveTab('intercity_hub');
      } else if (portal === 'admin') {
        setPortalMode('admin');
        setActiveTab('admin_control');
      }
    }
  }, [setActiveTab, setPortalMode]);

  // Modals state
  const [isNewTripOpen, setIsNewTripOpen] = useState(false);
  const [isNewActivityOpen, setIsNewActivityOpen] = useState(false);
  const [selectedDayForActivity, setSelectedDayForActivity] = useState<string | undefined>();
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isNewDocumentOpen, setIsNewDocumentOpen] = useState(false);
  const [isNewStoryOpen, setIsNewStoryOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isRoadAlertsOpen, setIsRoadAlertsOpen] = useState(false);
  const [isLiveTrackingOpen, setIsLiveTrackingOpen] = useState(false);

  const handleOpenNewActivity = (dayId?: string) => {
    setSelectedDayForActivity(dayId);
    setIsNewActivityOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-900 dark:selection:text-amber-100">
      
      {/* Top Sticky Header */}
      <Header 
        onOpenNewTrip={() => setIsNewTripOpen(true)} 
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenRoadAlerts={() => setIsRoadAlertsOpen(true)}
        onOpenLiveTracking={() => setIsLiveTrackingOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Intercity Hub and Driver Portal can be viewed even without a selected trip */}
        {activeTab === 'intercity_hub' && (
          <IntercityHub />
        )}

        {activeTab === 'driver_portal' && (
          <DriverPortal />
        )}

        {activeTab === 'admin_control' && (
          <AdminControlPortal />
        )}

        {/* Other tabs with active trip */}
        {activeTrip ? (
          <>
            {activeTab === 'overview' && (
              <TripOverview 
                onOpenNewActivity={() => handleOpenNewActivity()} 
                onOpenNewExpense={() => setIsNewExpenseOpen(true)}
                onOpenNewStory={() => setIsNewStoryOpen(true)}
              />
            )}

            {activeTab === 'fixed_plan' && (
              <FixedPlanSafety />
            )}

            {activeTab === 'map' && (
              <RouteMap />
            )}

            {activeTab === 'itinerary' && (
              <ItineraryView onOpenNewActivity={handleOpenNewActivity} />
            )}

            {activeTab === 'bookings' && (
              <BookingsView onOpenNewBooking={() => setIsNewBookingOpen(true)} />
            )}

            {activeTab === 'expenses' && (
              <ExpensesTracker onOpenNewExpense={() => setIsNewExpenseOpen(true)} />
            )}

            {activeTab === 'documents' && (
              <DocumentVault onOpenNewDocument={() => setIsNewDocumentOpen(true)} />
            )}

            {activeTab === 'packing' && (
              <PackingChecklist />
            )}

            {activeTab === 'stories' && (
              <StoryJournal onOpenNewStory={() => setIsNewStoryOpen(true)} />
            )}
          </>
        ) : (
          activeTab !== 'intercity_hub' && activeTab !== 'driver_portal' && activeTab !== 'admin_control' && (
            <div className="text-center py-20">
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-200">
                {lang === 'ar' ? 'ابدأ رحلتك القادمة في اليمن' : 'Start Your Next Journey in Yemen'}
              </h2>
              <button
                onClick={() => setIsNewTripOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition shadow-sm"
              >
                {lang === 'ar' ? '+ إنشاء وتخطيط مسار رحلة' : '+ Create Journey Plan'}
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-6 text-center text-xs text-stone-600 dark:text-stone-300">
        <p>
          {lang === 'ar' 
            ? 'المسافر (Traveler) — شبكة النقل بين محافظات اليمن الـ 22 وخطة السير الثابتة السحابية © 2026' 
            : 'Traveler — 22 Yemeni Governorates Intercity Transit Network © 2026'}
        </p>
      </footer>

      {/* Live Notification Floating Toast */}
      <LiveNotificationToast />

      {/* Modals */}
      <NewTripModal isOpen={isNewTripOpen} onClose={() => setIsNewTripOpen(false)} />
      <NewActivityModal 
        isOpen={isNewActivityOpen} 
        onClose={() => setIsNewActivityOpen(false)} 
        defaultDayId={selectedDayForActivity} 
      />
      <NewExpenseModal isOpen={isNewExpenseOpen} onClose={() => setIsNewExpenseOpen(false)} />
      <NewBookingModal isOpen={isNewBookingOpen} onClose={() => setIsNewBookingOpen(false)} />
      <NewDocumentModal isOpen={isNewDocumentOpen} onClose={() => setIsNewDocumentOpen(false)} />
      <NewStoryModal isOpen={isNewStoryOpen} onClose={() => setIsNewStoryOpen(false)} />
      <AuthControlModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <RoadAlertsModal isOpen={isRoadAlertsOpen} onClose={() => setIsRoadAlertsOpen(false)} />
      <FamilyLiveTrackingModal isOpen={isLiveTrackingOpen} onClose={() => setIsLiveTrackingOpen(false)} />
      
      {/* Zero Cost In-App Support Chat & Community FAQ Modal */}
      <InAppSupportChatModal />

      {/* Floating Free Chat Action Button */}
      <button
        id="floating-support-chat-trigger"
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-5 start-5 z-40 p-3 sm:px-4 sm:py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl shadow-emerald-600/40 flex items-center gap-2 transition active:scale-95 border-2 border-white/20"
        title={lang === 'ar' ? 'المحادثة المباشرة مع الإدارة مجاناً' : 'Direct Support Chat'}
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
          {chatMessages.filter(m => !m.readByAdmin && !m.isFromAdmin).length > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
          )}
        </div>
        <span className="hidden sm:inline font-bold text-xs">
          {lang === 'ar' ? 'تواصل مع الإدارة مجاناً' : 'Support Chat'}
        </span>
      </button>

    </div>
  );
};

export function App() {
  return (
    <TravelProvider>
      <AppContent />
    </TravelProvider>
  );
}

export default App;
