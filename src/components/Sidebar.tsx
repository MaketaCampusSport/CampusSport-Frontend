import { AdminView } from '../pages/AdminDashboard';
import { LayoutGrid, Database, Calendar, Trophy, Ban, Megaphone, PieChart, Sliders, History } from 'lucide-react';

interface SidebarProps {
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const menuItems = [
    { id: 'panoul_zilei', label: 'Panoul zilei', icon: LayoutGrid },
    { id: 'resurse', label: 'Resurse', icon: Database },
    { id: 'orar_ef', label: 'Orar EF', icon: Calendar },
    { id: 'evenimente', label: 'Evenimente', icon: Trophy },
    { id: 'blocari', label: 'Blocări', icon: Ban },
    { id: 'anunturi', label: 'Anunțuri', icon: Megaphone },
    { id: 'rapoarte', label: 'Rapoarte', icon: PieChart },
    { id: 'reguli', label: 'Reguli', icon: Sliders },
    { id: 'jurnal_audit', label: 'Jurnal audit', icon: History },
  ];

  return (
    <aside className="w-[260px] bg-brandDark text-white h-full flex flex-col shadow-2xl z-20 shrink-0">
      {/* Logo Area */}
      <div className="p-8 pb-6">
        <div className="font-black text-xl tracking-tight flex items-center gap-3">
          <span className="bg-brandYellow text-brandDark px-2 py-1 text-sm rounded-lg">C</span>
          CAMPUSSPORT
        </div>
      </div>
      
      <div className="px-8 pb-3 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Administrare</div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as AdminView)}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} className={`mr-3 ${isActive ? 'opacity-100 text-brandYellow' : 'opacity-50'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>
      
      {/* User Profile */}
      <div className="p-6 m-4 mt-auto rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brandYellow/20 text-brandYellow flex items-center justify-center font-bold">MI</div>
          <div>
            <div className="font-bold text-sm text-white">Maria Ionescu</div>
            <div className="text-xs font-medium text-gray-400">Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}