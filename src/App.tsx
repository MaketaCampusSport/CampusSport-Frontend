import { useState } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import AvailabilityScreen from './pages/AvailabilityScreen';
import StartScreen from './pages/StartScreen';
import { SelectedSlotSummary } from './data/availabilityMockData';

function App() {
  const [roleView, setRoleView] = useState<'student' | 'admin'>('student');
  const [selectedSportId, setSelectedSportId] = useState<string | null>(null);
  const [pendingBooking, setPendingBooking] = useState<SelectedSlotSummary | null>(null);

  const handleSelectSport = (sportId: string) => {
    setSelectedSportId(sportId);
    setPendingBooking(null);
  };

  return (
    <div className="min-h-screen bg-brandLightBg font-sans text-[#1E293B]">
      {/* Role switcher bar visible in development / preview */}
      <div className="bg-gray-900 text-white px-4 py-1.5 text-xs flex items-center justify-between">
        <span className="font-semibold text-gray-300">CampusSport Preview</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setRoleView('student');
              setSelectedSportId(null);
            }}
            className={`px-3 py-1 rounded-full font-bold transition-colors ${
              roleView === 'student'
                ? 'bg-brandYellow text-brandDark'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRoleView('admin')}
            className={`px-3 py-1 rounded-full font-bold transition-colors ${
              roleView === 'admin'
                ? 'bg-brandYellow text-brandDark'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {roleView === 'admin' ? (
        <AdminDashboard />
      ) : selectedSportId ? (
        <>
          <AvailabilityScreen
            sportId={selectedSportId}
            onBack={() => setSelectedSportId(null)}
            onContinue={(selection) => setPendingBooking(selection)}
          />

          {/* Temporary confirmation preview until MAKETA-70 is implemented */}
          {pendingBooking && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 bg-brandDark text-white text-xs px-4 py-2.5 rounded-full shadow-lg">
              Slot pregătit pentru Pasul 2 (MAKETA-70): {pendingBooking.resourceName} ·{' '}
              {pendingBooking.dayLabel}, {pendingBooking.time}
            </div>
          )}
        </>
      ) : (
        <StartScreen onSelectSport={handleSelectSport} />
      )}
    </div>
  );
}

export default App;