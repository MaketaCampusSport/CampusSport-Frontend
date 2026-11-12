import { Check } from 'lucide-react';

export default function Resurse() {
  return (
    <div className="p-10 h-full flex flex-col">
      <div className="flex justify-between items-end mb-8 shrink-0">
        <div>
           <h1 className="text-[28px] font-black tracking-tight text-brandDark">RESURSE</h1>
           <p className="text-sm font-medium text-gray-500 mt-1">6 resurse active · 1 dezactivată</p>
        </div>
        <button className="px-6 py-2.5 bg-brandDark text-white rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800">
          + Resursă nouă
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Table Side */}
        <div className="w-2/3 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
           <table className="w-full text-left">
              <thead>
                 <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wide bg-gray-50/50">
                    <th className="py-4 px-6">Resursă</th>
                    <th className="py-4 px-4">Sporturi</th>
                    <th className="py-4 px-4">Cap.</th>
                    <th className="py-4 px-4">Externi</th>
                    <th className="py-4 px-6">Stare</th>
                 </tr>
              </thead>
              <tbody className="text-sm font-semibold divide-y divide-gray-50 overflow-y-auto">
                 <tr className="hover:bg-gray-50 cursor-pointer">
                    <td className="py-4 px-6 flex items-center gap-3">
                       <div className="w-8 h-8 bg-gray-200 rounded-lg overflow-hidden"><img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&h=100&fit=crop"/></div>
                       Teren fotbal 1
                    </td>
                    <td className="py-4 px-4 text-gray-500">Fotbal</td>
                    <td className="py-4 px-4">22</td>
                    <td className="py-4 px-4 text-gray-500">Sloturi libere</td>
                    <td className="py-4 px-6"><span className="text-emerald-500">Activă</span></td>
                 </tr>
                 <tr className="bg-brandYellow/10 cursor-pointer">
                    <td className="py-4 px-6 flex items-center gap-3">
                       <div className="w-8 h-8 bg-gray-200 rounded-lg overflow-hidden"><img src="https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=100&h=100&fit=crop"/></div>
                       Terenul 2
                    </td>
                    <td className="py-4 px-4 text-gray-500">Baschet, Volei</td>
                    <td className="py-4 px-4">10</td>
                    <td className="py-4 px-4 text-gray-500">Sloturi libere</td>
                    <td className="py-4 px-6"><span className="text-emerald-500">Activă</span></td>
                 </tr>
                 <tr className="hover:bg-gray-50 cursor-pointer opacity-60">
                    <td className="py-4 px-6 flex items-center gap-3">
                       <div className="w-8 h-8 bg-gray-200 rounded-lg overflow-hidden"></div>
                       Teren 4 (exterior)
                    </td>
                    <td className="py-4 px-4 text-gray-500">Baschet</td>
                    <td className="py-4 px-4">10</td>
                    <td className="py-4 px-4 text-gray-500">Sloturi libere</td>
                    <td className="py-4 px-6"><span className="text-gray-400">Inactivă</span></td>
                 </tr>
              </tbody>
           </table>
        </div>

        {/* Edit Side (Terenul 2) */}
        <div className="w-1/3 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 overflow-y-auto">
           <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Editează · Terenul 2</h3>
           
           <div className="space-y-6">
              <div>
                 <label className="block text-xs font-bold mb-2">Nume</label>
                 <input type="text" defaultValue="Terenul 2" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-bold outline-none focus:border-brandYellow" />
              </div>
              
              <div>
                 <label className="block text-xs font-bold mb-3">Sporturi permise</label>
                 <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-400"><input type="checkbox" className="w-4 h-4 rounded" /> Fotbal</label>
                    <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-brandYellow" /> Baschet</label>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-400"><input type="checkbox" className="w-4 h-4 rounded" /> Tenis</label>
                    <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-brandYellow" /> Volei</label>
                 </div>
              </div>
              
              <div>
                 <label className="block text-xs font-bold mb-3">Dotări</label>
                 <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-brandDark text-white text-xs font-bold rounded-full flex items-center gap-1"><Check size={12}/> Panouri</span>
                    <span className="px-3 py-1 bg-brandDark text-white text-xs font-bold rounded-full flex items-center gap-1"><Check size={12}/> Mingi</span>
                    <span className="px-3 py-1 bg-brandDark text-white text-xs font-bold rounded-full flex items-center gap-1"><Check size={12}/> Vestiar</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-400 text-xs font-bold rounded-full border border-gray-200">Tribună</span>
                 </div>
              </div>

              <div>
                 <label className="block text-xs font-bold mb-2">Acces externi</label>
                 <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-bold outline-none">
                    <option>Doar sloturi libere (≤ 24h)</option>
                    <option>Niciodată</option>
                 </select>
              </div>

              <div className="pt-6 border-t border-gray-100 flex gap-3">
                 <button className="flex-1 py-3 bg-red-50 text-brandRed font-bold rounded-xl hover:bg-red-100">Dezactivează</button>
                 <button className="flex-1 py-3 bg-brandYellow text-brandDark font-bold rounded-xl hover:bg-yellow-400">Salvează</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}