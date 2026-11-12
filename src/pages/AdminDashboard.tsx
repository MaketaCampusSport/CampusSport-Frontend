import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PanoulZilei from './PanoulZilei';
import Resurse from './Resurse';
import Reguli from './Reguli';

export type AdminView = 'panoul_zilei' | 'resurse' | 'orar_ef' | 'evenimente' | 'blocari' | 'anunturi' | 'rapoarte' | 'reguli' | 'jurnal_audit';

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<AdminView>('panoul_zilei');

  const renderView = () => {
    switch (activeView) {
      case 'panoul_zilei': return <PanoulZilei />;
      case 'resurse': return <Resurse />;
      case 'reguli': return <Reguli />;
      default: return <div className="p-8 font-bold text-gray-400">Pagina în lucru...</div>;
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-brandGray">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}