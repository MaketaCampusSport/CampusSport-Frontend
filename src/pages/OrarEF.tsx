import { UploadCloud } from 'lucide-react';

export default function OrarEF() {
  return (
    <div className="p-10 h-full flex flex-col">
      <div className="flex justify-between items-end mb-8 shrink-0">
        <div>
           <h1 className="text-4xl font-condensed font-bold tracking-wide text-brandDark uppercase">Orar Educație Fizică</h1>
           <p className="text-[15px] font-medium text-gray-500 mt-1">Semestrul 1 - 2026-2027</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex-1 overflow-y-auto">
         {/* Stepper Progres */}
         <div className="flex gap-4 mb-8 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
               <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs">✓</div> Încarcă fișierul
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-brandBlue">
               <div className="w-6 h-6 rounded-full bg-brandBlue text-white flex items-center justify-center text-xs">2</div> Verifică conflictele
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
               <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs">3</div> Confirmă
            </div>
         </div>

         {/* Detalii fișier */}
         <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
            <div className="flex items-center gap-4">
               <UploadCloud className="text-gray-400 ml-2" size={24} />
               <div>
                  <div className="font-bold text-[15px]">orar_EF_sem1_2026.csv</div>
                  <div className="text-xs text-gray-500 font-semibold mt-0.5">38 ore recurente · 14 săptămâni · 532 blocări generate</div>
               </div>
            </div>
            <button className="text-sm font-bold text-gray-500 hover:text-brandDark px-4">Schimbă fișierul</button>
         </div>

         {/* Alertă Roșie Conflicte */}
         <div className="bg-red-50 border border-red-100 p-5 rounded-2xl mb-8">
            <div className="font-bold text-brandRed text-[15px]">9 rezervări existente se suprapun cu orele de EF</div>
            <div className="text-[13px] font-semibold text-red-500 mt-1">La confirmare vor fi anulate automat, cotele restituite și utilizatorii notificați (push + email).</div>
         </div>

         {/* Tabel Conflicte */}
         <table className="w-full text-left mb-8">
            <thead>
               <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="py-3 px-4">Utilizator</th>
                  <th className="py-3 px-4">Resursă</th>
                  <th className="py-3 px-4">Data și Ora</th>
                  <th className="py-3 px-4">Ora EF</th>
                  <th className="py-3 px-4">Acțiune</th>
               </tr>
            </thead>
            <tbody className="text-[14px] font-semibold divide-y divide-gray-50">
               <tr>
                  <td className="py-4 px-4">Andrei Popescu</td>
                  <td className="py-4 px-4 text-gray-500">Teren fotbal 1</td>
                  <td className="py-4 px-4">Lun 27 oct · 10:00</td>
                  <td className="py-4 px-4 text-gray-500">FEAA anul I - gr. 2</td>
                  <td className="py-4 px-4 text-brandRed font-bold">Anulare</td>
               </tr>
               <tr>
                  <td className="py-4 px-4">Diana Rusu</td>
                  <td className="py-4 px-4 text-gray-500">Sala fitness</td>
                  <td className="py-4 px-4">Mar 28 oct · 08:00</td>
                  <td className="py-4 px-4 text-gray-500">FIESC anul II</td>
                  <td className="py-4 px-4 text-brandRed font-bold">Anulare</td>
               </tr>
            </tbody>
         </table>

         <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <button className="px-6 py-3 text-[15px] font-bold text-gray-500 hover:bg-gray-100 rounded-full transition-colors">Înapoi</button>
            <button className="px-6 py-3 text-[15px] font-bold text-brandDark bg-brandYellow hover:bg-yellow-400 rounded-full shadow-md transition-colors">Confirmă importul și anunță</button>
         </div>
      </div>
    </div>
  );
}