import { useState } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import StartScreen from './pages/StartScreen';

function App() {
  const [roleView, setRoleView] = useState<'student' | 'admin'>('student');

  return (
    <div className="min-h-screen bg-brandLightBg font-sans text-[#1E293B]">
      {/* Role switcher bar for demo & testing */}
      <div className="bg-gray-900 text-white px-4 py-1.5 text-xs flex items-center justify-between">
        <span className="font-semibold text-gray-300">CampusSport Preview</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRoleView('student')}
            className={`px-3 py-1 rounded-full font-bold transition-colors ${
              roleView === 'student'
                ? 'bg-brandYellow text-brandDark'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Student (Start)
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

      {roleView === 'student' ? <StartScreen /> : <AdminDashboard />}
    </div>
  );
}

export default App;