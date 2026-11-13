import { Lock } from 'lucide-react';

export default function PanoulZilei() {
  return (
    <div className="p-10 h-full flex flex-col">
      
      <div className="flex justify-between items-end mb-8 shrink-0">
        <div>
           <h1 className="text-4xl font-condensed font-bold tracking-wide text-brandDark uppercase">Panoul Zilei</h1>
           <p className="text-[15px] font-medium text-gray-500 mt-1">Joi, 24 octombrie 2026</p>
        </div>
        <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-[15px] font-bold shadow-sm hover:bg-gray-50 transition-colors">
          Export raport
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8 shrink-0">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <div className="text-[13px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Rezervări azi</div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-[44px] font-condensed font-bold leading-none">47</span>
            <span className="text-sm font-bold text-emerald-500">+12%</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <div className="text-[13px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Check-in-uri</div>
          <div className="text-[44px] font-condensed font-bold leading-none text-emerald-500 mt-auto">31</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <div className="text-[13px] font-bold text-gray-400 mb-2 uppercase tracking-wide">No-show</div>
          <div className="text-[44px] font-condensed font-bold leading-none text-brandRed mt-auto">2</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <div className="text-[13px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Ocupare</div>
          <div className="text-[44px] font-condensed font-bold leading-none text-brandBlue mt-auto">72%</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex-1 overflow-y-auto">
         
         <div className="flex text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 pl-48">
            <div className="flex-1 text-center">8:00</div>
            <div className="flex-1 text-center">10:00</div>
            <div className="flex-1 text-center">12:00</div>
            <div className="flex-1 text-center">14:00</div>
            <div className="flex-1 text-center">16:00</div>
            <div className="flex-1 text-center">18:00</div>
            <div className="flex-1 text-center">20:00</div>
         </div>
         
         <div className="space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-gray-50">
               <div className="w-40 shrink-0">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&h=100&fit=crop" alt="Fotbal" className="w-full h-full object-cover"/>
                     </div>
                     <div>
                        <div className="font-bold text-[15px] leading-tight">Teren fotbal 1</div>
                        <button className="text-[11px] font-bold text-brandRed hover:text-red-700 flex items-center gap-1 mt-1 uppercase tracking-wide">
                          <Lock size={12} strokeWidth={3} /> Blochează
                        </button>
                     </div>
                  </div>
               </div>
               <div className="flex-1 grid grid-cols-7 gap-1.5 h-10">
                  <div className="bg-orange-50 rounded-lg"></div>
                  <div className="bg-gray-50 rounded-lg"></div>
                  <div className="bg-gray-50 rounded-lg"></div>
                  <div className="bg-brandBlue rounded-lg"></div>
                  <div className="bg-brandBlue rounded-lg"></div>
                  <div className="bg-orange-50 rounded-lg"></div>
                  <div className="bg-brandBlue rounded-lg"></div>
               </div>
            </div>

            <div className="flex items-center gap-6 pb-6 border-b border-gray-50">
               <div className="w-40 shrink-0">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=100&h=100&fit=crop" alt="Bazin" className="w-full h-full object-cover"/>
                     </div>
                     <div>
                        <div className="font-bold text-[15px] leading-tight">Bazin</div>
                        <button className="text-[11px] font-bold text-brandRed hover:text-red-700 flex items-center gap-1 mt-1 uppercase tracking-wide">
                           <Lock size={12} strokeWidth={3} /> Blochează
                        </button>
                     </div>
                  </div>
               </div>
               <div className="flex-1 grid grid-cols-7 gap-1.5 h-10">
                  <div className="bg-brandBlue rounded-lg"></div>
                  <div className="bg-brandBlue rounded-lg"></div>
                  <div className="bg-brandBlue rounded-lg"></div>
                  <div className="bg-red-100 rounded-lg"></div>
                  <div className="bg-red-100 rounded-lg"></div>
                  <div className="bg-brandBlue rounded-lg"></div>
                  <div className="bg-brandBlue rounded-lg"></div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}