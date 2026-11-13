export default function EmergencyBlockModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-brandDark/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl">
        
        {/* Header Roșu */}
        <div className="bg-red-50 px-8 py-5 border-b border-red-100 flex justify-between items-center">
          <h2 className="text-xs font-black text-brandRed uppercase tracking-widest flex items-center gap-2">
            ⚠️ Blocare de Urgență · Bazin
          </h2>
        </div>
        
        <div className="p-8">
          <p className="text-sm font-medium text-gray-600 mb-8 leading-relaxed">
            Resursa devine indisponibilă instant. Acțiunea este ireversibilă și va declanșa anularea în cascadă.
          </p>
          
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-2 gap-6">
               <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Motiv</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-brandDark outline-none">
                     <option>Avarie - țeavă spartă</option>
                  </select>
               </div>
               <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Interval</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-brandDark outline-none">
                     <option>Până la noi ordine</option>
                  </select>
               </div>
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-gray-400 mb-3 uppercase tracking-wide">Canale de notificare</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brandRed focus:ring-brandRed accent-brandRed" /> Push
                </label>
                <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brandRed focus:ring-brandRed accent-brandRed" /> Email
                </label>
                <label className="flex items-center gap-2 text-sm font-bold cursor-pointer text-gray-400">
                  <input type="checkbox" className="w-4 h-4 rounded" /> SMS
                </label>
              </div>
            </div>
          </div>

          <div className="bg-red-50/50 border border-red-100 p-5 rounded-2xl mb-8 flex items-start gap-4">
            <div className="text-[32px] font-black leading-none text-brandRed">23</div>
            <div>
               <div className="font-bold text-brandRed">rezervări vor fi anulate</div>
               <div className="text-xs font-medium text-red-500 mt-1">Cotele se restituie — alternative propuse automat.</div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              Renunță
            </button>
            <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-white bg-brandRed hover:bg-red-600 rounded-full shadow-lg shadow-red-200 transition-colors">
              Blochează și anunță
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}