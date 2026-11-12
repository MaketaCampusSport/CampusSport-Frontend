import { LayoutGrid, Database, Calendar, Trophy, Ban, Megaphone, PieChart, Sliders, History } from 'lucide-react';
import { AdminView } from '../pages/AdminDashboard';

interface SidebarProps {
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const menuItems = [
    { id: 'panoul', label: 'Panoul zilei', icon: LayoutGrid },
    { id: 'resurse', label: 'Resurse', icon: Database },
    { id: 'orar', label: 'Orar EF', icon: Calendar },
    { id: 'evenimente', label: 'Evenimente', icon: Trophy },
    { id: 'blocari', label: 'Blocări', icon: Ban },
    { id: 'anunturi', label: 'Anunțuri', icon: Megaphone },
    { id: 'rapoarte', label: 'Rapoarte', icon: PieChart },
    { id: 'reguli', label: 'Reguli', icon: Sliders },
    { id: 'audit', label: 'Jurnal audit', icon: History },
  ];

  return (
    <aside className="w-[260px] bg-brandDark text-white h-full flex flex-col shadow-xl shrink-0">
      <div className="p-8 pb-6">
        <div className="font-condensed font-bold text-2xl tracking-wide flex items-center gap-3">
          <span className="bg-brandYellow text-brandDark px-2 py-0.5 rounded-lg text-xl">C</span>
          CAMPUSSPORT
        </div>
      </div>
      <div className="px-8 pb-3 text-xs text-gray-400 font-condensed uppercase tracking-widest font-bold">Administrare</div>
      
      <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as AdminView)}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-[15px] font-semibold transition-colors ${
                isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} strokeWidth={2.5} className={`mr-4 ${isActive ? 'text-brandYellow' : 'opacity-60'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 m-4 mt-auto rounded-2xl bg-black/20 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brandYellow/20 text-brandYellow flex items-center justify-center font-bold text-lg font-condensed">MI</div>
          <div className="text-left">
            <div className="font-bold text-sm text-white leading-tight">Maria Ionescu</div>
            <div className="text-xs font-medium text-gray-400 mt-0.5">Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}