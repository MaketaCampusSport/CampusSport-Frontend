import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PanoulZilei from './PanoulZilei';
import Resurse from './Resurse';
import Reguli from './Reguli';
import JurnalAudit from './JurnalAudit';
import OrarEF from './OrarEF';
import Anunturi from './Anunturi';

export type AdminView = 'panoul' | 'resurse' | 'orar' | 'evenimente' | 'blocari' | 'anunturi' | 'rapoarte' | 'reguli' | 'audit';

// Un ecran generic (Placeholder) ca să nu crape aplicația când dai click pe o pagină nefinalizată
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-10 h-full flex flex-col">
       <h1 className="text-4xl font-condensed font-bold tracking-wide text-brandDark uppercase">{title}</h1>
       <div className="mt-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex-1 flex items-center justify-center text-gray-400 font-bold">
          Interfața pentru această pagină urmează să fie adăugată.
       </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<AdminView>('panoul');

  const renderView = () => {
    switch (activeView) {
      case 'panoul': return <PanoulZilei />;
      case 'resurse': return <Resurse />;
      case 'orar': return <OrarEF />;
      case 'anunturi': return <Anunturi />;
      case 'reguli': return <Reguli />;
      case 'audit': return <JurnalAudit />;
      case 'evenimente': return <PlaceholderPage title="Evenimente Universitare" />;
      case 'blocari': return <PlaceholderPage title="Blocări de Mentenanță" />;
      case 'rapoarte': return <PlaceholderPage title="Rapoarte și Statistici" />;
      default: return <PanoulZilei />;
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-brandLightBg">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}