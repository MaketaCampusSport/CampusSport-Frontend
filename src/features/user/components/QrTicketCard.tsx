import { useState } from 'react';
import { Calendar, QrCode, X } from 'lucide-react';

export interface ActiveReservation {
  id: string;
  code: string;
  sportName: string;
  resourceName: string;
  locationLabel: string;
  dayShort: string;
  dayNumber: string;
  dateLabel: string;
  timeSlot: string;
  checkInWindow: string;
}

interface QrTicketCardProps {
  reservation: ActiveReservation;
}

/**
 * Compact "Următoarea rezervare" card matching UI Design page 16,
 * with a yellow QR trigger opening the full-screen access pass (page 13).
 */
export default function QrTicketCard({ reservation }: QrTicketCardProps) {
  const [isQrOpen, setIsQrOpen] = useState(false);

  const renderQrSvg = (sizeClass: string) => (
    <svg
      viewBox="0 0 100 100"
      className={sizeClass}
      role="img"
      aria-label={`Cod QR rezervare ${reservation.code}`}
    >
      <rect width="100" height="100" rx="6" fill="#FFFFFF" />
      <path
        fill="#1A2238"
        d="M10 10h24v24H10V10zm4 4v16h16V14H14zm4 4h8v8h-8v-8zm48-8h24v24H66V10zm4 4v16h16V14H70zm4 4h8v8h-8v-8zM10 66h24v24H10V66zm4 4v16h16V70H14zm4 4h8v8h-8v-8z"
      />
      <path
        fill="#1A2238"
        d="M42 12h6v6h-6zm10 0h6v12h-6zm-10 12h6v10h-6zm10 10h6v6h-6zM12 42h12v6H12zm18 0h10v6H30zm16 0h12v6H46zm18 0h8v12h-8zm14 0h10v6H78zM42 54h12v6H42zm-24 2h12v4H18zm54 4h16v6H72zM42 66h6v12h-6zm12 4h10v6H54zm14 6h8v14h-8zm-26 8h16v6H42zm20 0h4v6h-4z"
      />
    </svg>
  );

  return (
    <>
      {/* UI-02: Compact upcoming reservation card (UI Design page 16) */}
      <section
        aria-label="Următoarea rezervare"
        className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center gap-3"
      >
        {/* Blue date badge (e.g., JOI / 24) */}
        <div className="w-12 h-14 rounded-xl bg-brandBlue text-white flex flex-col items-center justify-center shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider leading-none opacity-90">
            {reservation.dayShort}
          </span>
          <span className="font-condensed text-2xl font-bold leading-tight mt-0.5">
            {reservation.dayNumber}
          </span>
        </div>

        {/* Yellow QR quick-action button (min 44x44px touch target - UI-05) */}
        <button
          type="button"
          onClick={() => setIsQrOpen(true)}
          aria-label={`Deschide codul QR pentru ${reservation.sportName} ${reservation.resourceName}`}
          className="w-12 h-12 min-w-[44px] min-h-[44px] rounded-xl bg-brandYellow hover:bg-yellow-400 active:scale-95 text-brandDark flex items-center justify-center shrink-0 transition-transform shadow-xs"
        >
          <QrCode size={24} strokeWidth={2.25} />
        </button>

        {/* Reservation summary */}
        <button
          type="button"
          onClick={() => setIsQrOpen(true)}
          className="min-w-0 flex-1 text-left py-0.5"
        >
          <p className="text-[11px] font-medium text-slate-400 leading-tight">
            Următoarea rezervare
          </p>
          <p className="text-sm font-bold text-brandDark truncate mt-0.5">
            {reservation.sportName} · {reservation.resourceName}
          </p>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            {reservation.timeSlot}
          </p>
        </button>
      </section>

      {/* Full QR Access Pass Modal (aligned with UI Design page 13) */}
      {isQrOpen && (
        <div
          className="fixed inset-0 z-50 bg-brandDark/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Codul tău de acces"
        >
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brandBlue">
                Codul tău de acces
              </span>
              <button
                type="button"
                onClick={() => setIsQrOpen(false)}
                className="min-w-[44px] min-h-[44px] rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-brandDark"
                aria-label="Închide"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 mb-4">
              <div className="flex items-center justify-between text-xs font-bold text-brandBlue">
                <span className="uppercase">{reservation.sportName}</span>
                <span className="font-mono text-slate-500">{reservation.code}</span>
              </div>
              <p className="text-base font-bold text-brandDark mt-0.5">
                {reservation.resourceName} · {reservation.locationLabel}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                <Calendar size={13} className="text-brandBlue" />
                <span>
                  {reservation.dateLabel} · {reservation.timeSlot}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-2">
              {renderQrSvg('w-48 h-48')}
              <p className="font-bold text-sm text-brandDark mt-2">
                Cod: {reservation.code}
              </p>
            </div>

            <div className="mt-3 bg-blue-50/80 rounded-xl p-3 text-left">
              <p className="text-xs font-bold text-brandBlue">
                Check-in: {reservation.checkInWindow}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                Arată codul QR personalului de la intrare (-10/+15 min față de ora rezervării).
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}