export default function Reguli() {
  return (
    <div className="p-10 h-full flex flex-col">
      <div className="flex justify-between items-end mb-8 shrink-0">
        <div>
           <h1 className="text-[28px] font-black tracking-tight text-brandDark">REGULI DE REZERVARE</h1>
           <p className="text-sm font-medium text-gray-500 mt-1">Valorile se aplică imediat pentru rezervările noi</p>
        </div>
        <button className="px-6 py-2.5 bg-brandYellow text-brandDark rounded-xl text-sm font-bold shadow-sm hover:bg-yellow-400">
          Salvează modificările
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8 flex-1 overflow-y-auto pb-10">
         {/* Coloana 1 */}
         <div className="space-y-8">
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
               <h3 className="text-xs font-black text-brandBlue uppercase tracking-widest mb-6">Cotă Studenți</h3>
               
               <div className="space-y-6">
                  <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                     <div>
                        <div className="font-bold">Rezervări gratuite / lună</div>
                        <div className="text-xs text-gray-400 mt-0.5 font-mono">BR-01</div>
                     </div>
                     <input type="number" defaultValue="4" className="w-20 text-center bg-gray-50 border border-gray-200 rounded-xl py-2 font-bold outline-none focus:border-brandYellow" />
                  </div>
                  
                  <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                     <div>
                        <div className="font-bold">Rezervări viitoare active</div>
                        <div className="text-xs text-gray-400 mt-0.5 font-mono">BR-02</div>
                     </div>
                     <input type="number" defaultValue="2" className="w-20 text-center bg-gray-50 border border-gray-200 rounded-xl py-2 font-bold outline-none focus:border-brandYellow" />
                  </div>

                  <div className="flex justify-between items-center">
                     <div>
                        <div className="font-bold">Cotă separată pe sport</div>
                     </div>
                     {/* Toggle Switch Component Fake */}
                     <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                     </div>
                  </div>
               </div>
            </section>

            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
               <h3 className="text-xs font-black text-brandBlue uppercase tracking-widest mb-6">Anulare și Check-in</h3>
               <div className="space-y-6">
                  <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                     <div>
                        <div className="font-bold">Anulare fără penalizare</div>
                        <div className="text-xs text-gray-400 mt-0.5 font-mono">BR-04</div>
                     </div>
                     <select className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 font-bold outline-none">
                        <option>2 h înainte</option>
                        <option>3 h înainte</option>
                     </select>
                  </div>
               </div>
            </section>
         </div>

         {/* Coloana 2 */}
         <div className="space-y-8">
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
               <h3 className="text-xs font-black text-brandBlue uppercase tracking-widest mb-6">Penalizări și Listă de Așteptare</h3>
               <div className="space-y-6">
                  <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                     <div>
                        <div className="font-bold">No-show-uri până la suspendare</div>
                        <div className="text-xs text-gray-400 mt-0.5 font-mono">BR-06</div>
                     </div>
                     <select className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 font-bold outline-none">
                        <option>3 / lună</option>
                     </select>
                  </div>
                  <div className="flex justify-between items-center">
                     <div>
                        <div className="font-bold">Durata suspendării</div>
                     </div>
                     <select className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 font-bold outline-none text-brandRed">
                        <option>14 zile</option>
                        <option>7 zile</option>
                     </select>
                  </div>
               </div>
            </section>
         </div>
      </div>
    </div>
  );
}