import { useMemo, useState } from 'react';
import {
  Calendar,
  CalendarPlus,
  Check,
  ChevronLeft,
  Clock,
  Info,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { SelectedSlotSummary } from '../data/availabilityMockData';
import { ActiveReservation } from '../components/QrTicketCard';

interface BookingConfirmScreenProps {
  selection: SelectedSlotSummary;
  remainingEntries: number;
  totalEntries: number;
  onBack: () => void;
  onComplete: (createdReservation: ActiveReservation) => void;
}

const RESOURCE_IMAGES: Record<string, string> = {
  baschet:
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80',
  fotbal:
    'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80',
  tenis:
    'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=80',
  volei:
    'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=900&q=80',
  fitness:
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
  inot:
    'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=900&q=80',
};

const SPORT_CAPACITY: Record<string, number> = {
  fotbal: 22,
  baschet: 10,
  tenis: 4,
  volei: 12,
  fitness: 30,
  inot: 24,
};

function computeCheckInWindow(startTime: string): string {
  const [hoursStr, minutesStr] = startTime.split(':');
  const startTotalMinutes = Number(hoursStr) * 60 + Number(minutesStr);

  const formatMinutes = (totalMins: number) => {
    const normalized = ((totalMins % 1440) + 1440) % 1440;
    const h = Math.floor(normalized / 60)
      .toString()
      .padStart(2, '0');
    const m = (normalized % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  return `${formatMinutes(startTotalMinutes - 10)} – ${formatMinutes(
    startTotalMinutes + 15
  )}`;
}

/**
 * Confirmation (Step 02/03) & Success with QR (Step 03/03) screens (MAKETA-70 / FR-11).
 * Aligned with UI Design pages 19 and 20.
 */
export default function BookingConfirmScreen({
  selection,
  remainingEntries,
  totalEntries,
  onBack,
  onComplete,
}: BookingConfirmScreenProps) {
  const [step, setStep] = useState<'confirm' | 'success'>('confirm');
  const [participantsCount, setParticipantsCount] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarSaved, setCalendarSaved] = useState(false);

  const maxCapacity = SPORT_CAPACITY[selection.sportId] ?? 10;
  const remainingAfterBooking = Math.max(0, remainingEntries - 1);
  const checkInWindow = useMemo(
    () => computeCheckInWindow(selection.time),
    [selection.time]
  );

  // Deterministic reservation code for the confirmed session
  const reservationCode = useMemo(() => {
    const numericSuffix =
      (selection.time.replace(':', '') + selection.resourceName.length * 17).slice(
        0,
        4
      );
    return `#RES-${numericSuffix.padEnd(4, '4')}`;
  }, [selection.time, selection.resourceName]);

  const createdReservation: ActiveReservation = useMemo(() => {
    const [dayShortRaw, dayRest] = selection.dayLabel.split(',');
    const dayNumberMatch = (dayRest ?? '').trim().match(/\d+/);
    return {
      id: `res-${Date.now()}`,
      code: reservationCode,
      sportName: selection.sportName,
      resourceName: selection.resourceName,
      locationLabel: selection.location,
      dayShort: (dayShortRaw ?? 'JOI').trim().toUpperCase(),
      dayNumber: dayNumberMatch ? dayNumberMatch[0] : '24',
      dateLabel: selection.dayLabel,
      timeSlot: `${selection.time} – ${selection.endTime}`,
      checkInWindow,
    };
  }, [selection, reservationCode, checkInWindow]);

  const handleConfirmBooking = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 250);
  };

  const handleAddToCalendar = () => {
    const dateCompact = selection.dayId.replace(/-/g, '');
    const startCompact = selection.time.replace(':', '') + '00';
    const endCompact = selection.endTime.replace(':', '') + '00';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CampusSport//Rezervare//RO',
      'BEGIN:VEVENT',
      `UID:${reservationCode.replace('#', '')}@campussport.ro`,
      `DTSTART:${dateCompact}T${startCompact}`,
      `DTEND:${dateCompact}T${endCompact}`,
      `SUMMARY:${selection.sportName} - ${selection.resourceName} (${reservationCode})`,
      `LOCATION:${selection.resourceName}, ${selection.location}`,
      `DESCRIPTION:Cod acces QR: ${reservationCode}. Check-in permis între ${checkInWindow}.`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CampusSport-${reservationCode.replace('#', '')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setCalendarSaved(true);
  };

  const renderQrSvg = () => (
    <svg
      viewBox="0 0 100 100"
      className="w-48 h-48"
      role="img"
      aria-label={`Cod QR rezervare ${reservationCode}`}
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

  // STEP 03/03: Success Screen with QR (UI Design page 20)
  if (step === 'success') {
    const shortDayLabel = selection.dayLabel.replace(',', '');

    return (
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-between max-w-md mx-auto shadow-xs border-x border-slate-200/70">
        <header className="bg-white border-b border-slate-200/80 px-4 py-3.5 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            03/03 REZERVARE CONFIRMATĂ
          </span>
          <span className="font-mono text-xs font-bold text-slate-500">
            {reservationCode}
          </span>
        </header>

        <main className="flex-1 px-4 py-5 flex flex-col items-center justify-center text-center space-y-5 overflow-y-auto">
          {/* QR Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center">
            {renderQrSvg()}
            <span className="mt-2 font-mono text-xs font-bold text-brandDark">
              {reservationCode}
            </span>
          </div>

          {/* Headline & Subtitle */}
          <div>
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brandYellow text-brandDark mb-2">
              <Check size={18} strokeWidth={3} />
            </div>
            <h1 className="font-condensed text-4xl font-extrabold uppercase tracking-wide text-brandDark leading-none">
              GATA!
            </h1>
            <p className="text-sm font-medium text-slate-600 mt-1.5">
              Te așteptăm <span className="font-bold text-brandDark">{shortDayLabel.toLowerCase()}</span> la{' '}
              <span className="font-bold text-brandDark">{selection.time}</span> pe{' '}
              <span className="font-bold text-brandDark">{selection.resourceName}</span>
            </p>
          </div>

          {/* 3-Column Summary Card: TEREN | DATA | ORA */}
          <div className="w-full bg-white rounded-2xl p-4 shadow-xs border border-slate-100 grid grid-cols-3 divide-x divide-slate-100">
            <div className="px-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                TEREN
              </p>
              <p className="text-xs font-extrabold text-brandDark mt-1 truncate">
                {selection.resourceName}
              </p>
            </div>
            <div className="px-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                DATA
              </p>
              <p className="text-xs font-extrabold text-brandDark mt-1">
                {shortDayLabel}
              </p>
            </div>
            <div className="px-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                ORA
              </p>
              <p className="text-xs font-extrabold text-brandDark mt-1">
                {selection.time}
              </p>
            </div>
          </div>

          <p className="text-xs font-medium text-slate-500">
            Arată codul la intrare · Check-in permis între{' '}
            <span className="font-bold text-brandDark">{checkInWindow}</span>
          </p>
        </main>

        <footer className="bg-white border-t border-slate-200/80 px-4 py-4 space-y-2.5 shrink-0">
          <button
            type="button"
            onClick={handleAddToCalendar}
            className="w-full min-h-[48px] rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-brandDark font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <CalendarPlus size={18} className="text-brandBlue" />
            <span>
              {calendarSaved ? 'Adăugat în calendar (.ics)' : 'Adaugă în calendar'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onComplete(createdReservation)}
            className="w-full min-h-[48px] rounded-2xl bg-brandYellow hover:bg-yellow-400 text-brandDark font-bold text-[15px] shadow-xs transition-colors"
          >
            Gata
          </button>
        </footer>
      </div>
    );
  }

  // STEP 02/03: Confirmation Screen (UI Design page 19)
  const heroImage =
    RESOURCE_IMAGES[selection.sportId] ?? RESOURCE_IMAGES.baschet;

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-between max-w-md mx-auto shadow-xs border-x border-slate-200/70">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200/80 px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="Înapoi la alegerea orei"
            className="w-11 h-11 min-w-[44px] min-h-[44px] -ml-2 rounded-full hover:bg-slate-100 flex items-center justify-center text-brandDark transition-colors"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>

          <div className="text-center">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-brandBlue">
              02/03 CONFIRMĂ
            </span>
            <h1 className="font-condensed text-2xl font-bold uppercase tracking-wide text-brandDark leading-tight">
              Confirmă
            </h1>
          </div>

          <div className="w-11" aria-hidden="true" />
        </div>
        <p className="text-center text-xs font-medium text-slate-500 mt-0.5">
          Verifică detaliile rezervării
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {/* Resource Hero Banner (matches UI Design page 19) */}
        <div className="relative h-36 rounded-2xl overflow-hidden bg-brandDark shadow-xs">
          <img
            src={heroImage}
            alt={selection.resourceName}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-3.5 left-4 right-4 text-white">
            <h2 className="font-condensed text-2xl font-extrabold uppercase tracking-wide leading-tight">
              {selection.resourceName}
            </h2>
            <p className="text-xs font-medium text-white/90 mt-0.5">
              {selection.sportName} · {selection.location}
            </p>
          </div>
        </div>

        {/* Booking Details Card */}
        <section
          aria-label="Detalii rezervare"
          className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 divide-y divide-slate-100"
        >
          <div className="pb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-slate-500">
              <Calendar size={17} className="text-brandBlue shrink-0" />
              <span className="text-xs font-semibold">Data</span>
            </div>
            <span className="text-sm font-bold text-brandDark">
              {selection.dayLabel} 2026
            </span>
          </div>

          <div className="py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-slate-500">
              <Clock size={17} className="text-brandBlue shrink-0" />
              <span className="text-xs font-semibold">Ora</span>
            </div>
            <span className="text-sm font-bold text-brandDark">
              {selection.time} – {selection.endTime}
            </span>
          </div>

          <div className="pt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-slate-500">
              <Users size={17} className="text-brandBlue shrink-0" />
              <div>
                <span className="block text-xs font-semibold">Participanți</span>
                <span className="block text-[11px] text-slate-400">
                  Opțional până la {maxCapacity}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Scade numărul de participanți"
                onClick={() =>
                  setParticipantsCount((prev) => Math.max(1, prev - 1))
                }
                className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-brandDark flex items-center justify-center"
              >
                -
              </button>
              <span className="w-7 text-center text-sm font-extrabold text-brandDark">
                {participantsCount}
              </span>
              <button
                type="button"
                aria-label="Crește numărul de participanți"
                onClick={() =>
                  setParticipantsCount((prev) => Math.min(maxCapacity, prev + 1))
                }
                className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-brandDark flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </section>

        {/* Quota & Policies Card (FR-11, BR-04, BR-05) */}
        <section
          aria-label="Cotă și reguli"
          className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3"
        >
          <div className="flex items-center justify-between bg-blue-50/80 rounded-xl px-3.5 py-2.5">
            <span className="text-xs font-bold text-brandDark">
              Folosești 1 intrare din cotă
            </span>
            <span className="text-xs font-extrabold text-brandBlue">
              {remainingAfterBooking} din {totalEntries} rămân
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span>Anulare gratuită până la 2 h înainte</span>
            </div>
            <div className="flex items-center gap-2">
              <Info size={16} className="text-brandBlue shrink-0" />
              <span>
                Check-in cu QR între -10 și +15 min ({checkInWindow})
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Action Buttons (UI Design page 19) */}
      <footer className="bg-white border-t border-slate-200/80 px-4 py-4 space-y-2.5 shrink-0">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleConfirmBooking}
          className="w-full min-h-[48px] rounded-2xl bg-brandYellow hover:bg-yellow-400 disabled:opacity-60 text-brandDark font-bold text-[15px] shadow-xs transition-colors"
        >
          {isSubmitting ? 'Se confirmă...' : 'Confirmă rezervarea'}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full min-h-[44px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
        >
          Înapoi
        </button>
      </footer>
    </div>
  );
}