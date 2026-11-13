import { useState } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import AvailabilityScreen from './pages/AvailabilityScreen';
import BookingConfirmScreen from './pages/BookingConfirmScreen';
import StartScreen, { DEFAULT_UPCOMING_RESERVATION } from './pages/StartScreen';
import { SelectedSlotSummary } from './data/availabilityMockData';
import { ActiveReservation } from './components/QrTicketCard';

function App() {
  const [roleView, setRoleView] = useState<'student' | 'admin'>('student');
  const [selectedSportId, setSelectedSportId] = useState<string | null>(null);
  const [pendingBooking, setPendingBooking] = useState<SelectedSlotSummary | null>(null);

  const totalEntries = 4;
  const [remainingEntries, setRemainingEntries] = useState<number>(3);
  const [upcomingReservation, setUpcomingReservation] = useState<ActiveReservation>(
    DEFAULT_UPCOMING_RESERVATION
  );

  const handleSelectSport = (sportId: string) => {
    setSelectedSportId(sportId);
    setPendingBooking(null);
  };

  const handleBookingComplete = (createdReservation: ActiveReservation) => {
    setUpcomingReservation(createdReservation);
    setRemainingEntries((prev) => Math.max(0, prev - 1));
    setPendingBooking(null);
    setSelectedSportId(null);
  };

  const renderStudentFlow = () => {
    if (pendingBooking) {
      return (
        <BookingConfirmScreen
          selection={pendingBooking}
          remainingEntries={remainingEntries}
          totalEntries={totalEntries}
          onBack={() => setPendingBooking(null)}
          onComplete={handleBookingComplete}
        />
      );
    }

    if (selectedSportId) {
      return (
        <AvailabilityScreen
          sportId={selectedSportId}
          onBack={() => setSelectedSportId(null)}
          onContinue={(selection) => setPendingBooking(selection)}
        />
      );
    }

    return (
      <StartScreen
        remainingEntries={remainingEntries}
        totalEntries={totalEntries}
        upcomingReservation={upcomingReservation}
        onSelectSport={handleSelectSport}
      />
    );
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
              setPendingBooking(null);
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

      {roleView === 'admin' ? <AdminDashboard /> : renderStudentFlow()}
    </div>
  );
}

export default App;