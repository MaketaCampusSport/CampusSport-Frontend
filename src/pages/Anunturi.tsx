export default function Anunturi() {
  return (
    <div className="p-10 h-full flex flex-col">
      <div className="flex justify-between items-end mb-8 shrink-0">
        <div>
           <h1 className="text-4xl font-condensed font-bold tracking-wide text-brandDark uppercase">Anunțuri</h1>
           <p className="text-[15px] font-medium text-gray-500 mt-1">Mesaje către utilizatorii cu rezervări</p>
        </div>
      </div>

      <div className="flex gap-8 flex-1 min-h-0">
         
         {/* Partea Stângă: Formular Trimitere */}
         <div className="w-3/5 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 overflow-y-auto">
            <h3 className="text-[13px] font-black text-brandBlue uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Anunț Nou</h3>
            
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div>
                     <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Destinatari</label>
                     <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-bold outline-none cursor-pointer focus:border-brandYellow">
                        <option>Toți cu rezervări</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Resursă</label>
                     <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-bold outline-none cursor-pointer focus:border-brandYellow">
                        <option>Sala fitness</option>
                     </select>
                  </div>
               </div>

               <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Titlu</label>
                  <input type="text" defaultValue="Aer condiționat oprit vineri" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-bold outline-none focus:border-brandYellow" />
               </div>

               <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Mesaj</label>
                  <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-bold outline-none focus:border-brandYellow resize-none" defaultValue="Vineri, sala de fitness funcționează fără aer condiționat. Rezervările rămân valabile; dacă preferi, poți anula gratuit până joi seara."></textarea>
               </div>

               <div className="flex justify-between items-end pt-4">
                  <div>
                     <label className="block text-[11px] font-bold text-gray-400 mb-3 uppercase tracking-wide">Canale</label>
                     <div className="flex gap-4">
                       <label className="flex items-center gap-2 text-sm font-bold cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brandYellow focus:ring-brandYellow accent-brandYellow" /> Push</label>
                       <label className="flex items-center gap-2 text-sm font-bold cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brandYellow focus:ring-brandYellow accent-brandYellow" /> Email</label>
                       <label className="flex items-center gap-2 text-sm font-bold cursor-pointer text-gray-400"><input type="checkbox" className="w-4 h-4 rounded" /> SMS</label>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="text-xs font-bold text-gray-400 mb-3">Ajunge la <span className="text-brandDark">38 de utilizatori</span></div>
                     <button className="px-6 py-3 text-[15px] font-bold text-brandDark bg-brandYellow hover:bg-yellow-400 rounded-full shadow-md transition-colors">Trimite anunțul</button>
                  </div>
               </div>
            </div>
         </div>

         {/* Partea Dreaptă: Istoric */}
         <div className="w-2/5 bg-gray-50/50 rounded-3xl border border-gray-200 p-8 overflow-y-auto">
            <h3 className="text-[13px] font-black text-gray-400 uppercase tracking-widest mb-6">Trimise Recent</h3>
            
            <div className="space-y-4">
               <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-1 cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-[10px] font-bold bg-red-100 text-brandRed px-2 py-0.5 rounded uppercase tracking-wide">Urgență</span>
                     <span className="text-xs font-bold text-gray-400">azi, 14:21</span>
                  </div>
                  <div className="font-bold text-[15px] mb-1">Bazin închis - avarie</div>
                  <div className="text-xs font-semibold text-gray-500">23 destinatari · livrat 100%</div>
               </div>
               
               <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-1 cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-wide">General</span>
                     <span className="text-xs font-bold text-gray-400">20 oct</span>
                  </div>
                  <div className="font-bold text-[15px] mb-1">Program redus de 1 Decembrie</div>
                  <div className="text-xs font-semibold text-gray-500">412 destinatari · livrat 100%</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}