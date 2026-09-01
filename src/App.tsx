import React, { useState } from 'react';
import { TravelProvider, useTravel } from './context/TravelContext';
import { Header } from './components/Header';
import { TripOverview } from './components/TripOverview';
import { IntercityHub } from './components/IntercityHub';
import { FixedPlanSafety } from './components/FixedPlanSafety';
import { DriverPortal } from './components/DriverPortal';
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

const AppContent: React.FC = () => {
  const { activeTab, activeTrip, lang } = useTravel();

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
          activeTab !== 'intercity_hub' && activeTab !== 'driver_portal' && (
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
            ? 'سَفَر — شبكة النقل بين محافظات اليمن الـ 22 وخطة السير الثابتة السحابية © 2026' 
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
