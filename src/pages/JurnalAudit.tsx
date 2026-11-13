import { Search } from 'lucide-react';

export default function JurnalAudit() {
  return (
    <div className="p-10 h-full flex flex-col">
      <div className="flex justify-between items-end mb-8 shrink-0">
        <div>
           <h1 className="text-4xl font-condensed font-bold tracking-wide text-brandDark uppercase">Jurnal Audit</h1>
           <p className="text-[15px] font-medium text-gray-500 mt-1">Toate acțiunile administrative păstrate 12 luni</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
         {/* Bara de sus cu Search */}
         <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <div className="relative w-80">
               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
               <input type="text" placeholder="Caută actor, acțiune..." className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold outline-none focus:border-brandYellow" />
            </div>
            <div className="flex gap-3">
               <select className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none cursor-pointer"><option>Toți actorii</option></select>
               <select className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none cursor-pointer"><option>Ultimele 7 zile</option></select>
               <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50">Export CSV</button>
            </div>
         </div>
         
         {/* Tabel */}
         <div className="overflow-y-auto flex-1 px-2">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                     <th className="py-4 px-6">Data și Ora</th>
                     <th className="py-4 px-6">Actor</th>
                     <th className="py-4 px-6">Acțiune</th>
                     <th className="py-4 px-6">Obiect</th>
                  </tr>
               </thead>
               <tbody className="text-[14px] font-semibold divide-y divide-gray-50">
                  <tr className="hover:bg-gray-50 transition-colors">
                     <td className="py-4 px-6 text-gray-500">24 oct 14:21</td>
                     <td className="py-4 px-6 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-brandYellow/20 text-brandYellow flex items-center justify-center font-bold text-xs font-condensed">MI</div>
                        Maria Ionescu
                     </td>
                     <td className="py-4 px-6 text-brandDark">Blocare urgență</td>
                     <td className="py-4 px-6 text-gray-500">Bazin · până la noi ordine · 23 rezervări anulate</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                     <td className="py-4 px-6 text-gray-500">23 oct 16:40</td>
                     <td className="py-4 px-6 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-brandBlue flex items-center justify-center font-bold text-xs font-condensed">DR</div>
                        Dan Rusu
                     </td>
                     <td className="py-4 px-6 text-brandDark">Import orar EF</td>
                     <td className="py-4 px-6 text-gray-500">orar_EF_sem1_2026.csv · 532 blocări create</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}