import { useState } from 'react';
import { Calendar, Home, Search, User } from 'lucide-react';
import QrTicketCard, { ActiveReservation } from '../components/QrTicketCard';

interface SportCardItem {
  id: string;
  name: string;
  imageUrl: string;
  fallbackGradient: string;
}

const SPORTS_GRID: SportCardItem[] = [
  {
    id: 'fotbal',
    name: 'Fotbal',
    imageUrl:
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=600&q=80',
    fallbackGradient: 'from-emerald-800 to-emerald-950',
  },
  {
    id: 'baschet',
    name: 'Baschet',
    imageUrl:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80',
    fallbackGradient: 'from-amber-800 to-stone-900',
  },
  {
    id: 'tenis',
    name: 'Tenis',
    imageUrl:
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80',
    fallbackGradient: 'from-blue-700 to-slate-900',
  },
  {
    id: 'volei',
    name: 'Volei',
    imageUrl:
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=600&q=80',
    fallbackGradient: 'from-orange-700 to-slate-900',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    imageUrl:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    fallbackGradient: 'from-slate-700 to-slate-950',
  },
  {
    id: 'inot',
    name: 'Înot',
    imageUrl:
      'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=600&q=80',
    fallbackGradient: 'from-cyan-700 to-blue-950',
  },
];

export const DEFAULT_UPCOMING_RESERVATION: ActiveReservation = {
  id: 'res-8924',
  code: '#RES-8924',
  sportName: 'Fotbal',
  resourceName: 'Terenul 1',
  locationLabel: 'Exterior',
  dayShort: 'JOI',
  dayNumber: '24',
  dateLabel: 'Joi, 24 oct',
  timeSlot: '17:00 – 18:00',
  checkInWindow: '16:50 – 17:15',
};

interface StartScreenProps {
  remainingEntries?: number;
  totalEntries?: number;
  upcomingReservation?: ActiveReservation;
  onSelectSport?: (sportId: string) => void;
}

/**
 * Student Start Screen matching UI Design page 16 (MAKETA-68).
 */
export default function StartScreen({
  remainingEntries = 3,
  totalEntries = 4,
  upcomingReservation = DEFAULT_UPCOMING_RESERVATION,
  onSelectSport,
}: StartScreenProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'bookings' | 'profile'>('home');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-between max-w-md mx-auto shadow-xs border-x border-slate-200/70">
      {/* Main Content */}
      <div className="flex-1 px-4 pt-5 pb-4 flex flex-col justify-between gap-4 overflow-y-auto">
        {/* Top Greeting Header */}
        <header className="flex items-center justify-between pt-1">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              CE SPORT JOCI AZI?
            </p>
            <h1 className="font-condensed text-3xl font-bold text-brandDark leading-tight mt-0.5">
              Salut, Andrei
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            aria-label="Profilul meu"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-brandDark text-white font-condensed font-bold text-sm tracking-wide flex items-center justify-center shadow-xs"
          >
            AP
          </button>
        </header>

        {/* FR-26: Segmented Monthly Quota Card */}
        <section
          aria-label="Intrări rămase în luna curentă"
          className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-brandBlue leading-none">
                {remainingEntries}
              </span>
              <span className="text-sm font-bold text-brandDark">
                din {totalEntries} intrări rămase
              </span>
            </div>

            <span className="text-xs font-semibold text-brandBlue bg-blue-50 px-3 py-1 rounded-full">
              Noiembrie
            </span>
          </div>

          <div
            className="grid grid-cols-4 gap-2"
            role="progressbar"
            aria-valuenow={remainingEntries}
            aria-valuemin={0}
            aria-valuemax={totalEntries}
            aria-label={`${remainingEntries} din ${totalEntries} intrări rămase`}
          >
            {Array.from({ length: totalEntries }).map((_, index) => {
              const isActive = index < remainingEntries;
              return (
                <span
                  key={index}
                  className={`h-2 rounded-full transition-colors ${
                    isActive ? 'bg-brandBlue' : 'bg-slate-200'
                  }`}
                />
              );
            })}
          </div>
        </section>

        {/* UI-02: 3x2 Photographic Sport Selection Grid */}
        <section aria-label="Alege sportul" className="my-auto">
          <div className="grid grid-cols-3 gap-2.5">
            {SPORTS_GRID.map((sport) => {
              const hasImageError = Boolean(failedImages[sport.id]);

              return (
                <button
                  key={sport.id}
                  type="button"
                  onClick={() => onSelectSport?.(sport.id)}
                  className="group relative aspect-square min-h-[96px] rounded-2xl overflow-hidden bg-slate-800 text-left shadow-xs focus:outline-none focus:ring-2 focus:ring-brandBlue active:scale-[0.98] transition-transform"
                >
                  {!hasImageError ? (
                    <img
                      src={sport.imageUrl}
                      alt={sport.name}
                      loading="lazy"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [sport.id]: true }))
                      }
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${sport.fallbackGradient}`}
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  <span className="absolute bottom-2.5 left-3 right-2 text-white font-bold text-sm leading-tight drop-shadow-xs">
                    {sport.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* UI-02: Next reservation card with quick QR pass */}
        <QrTicketCard reservation={upcomingReservation} />
      </div>

      {/* Bottom Navigation Bar */}
      <nav
        aria-label="Navigare principală"
        className="bg-white border-t border-slate-200/80 px-2 py-1.5 grid grid-cols-4 shrink-0"
      >
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition-colors ${
            activeTab === 'home' ? 'text-brandBlue' : 'text-slate-400 hover:text-brandDark'
          }`}
        >
          <Home size={20} strokeWidth={2.2} />
          <span>Acasă</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('search')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors ${
            activeTab === 'search' ? 'text-brandBlue' : 'text-slate-400 hover:text-brandDark'
          }`}
        >
          <Search size={20} strokeWidth={2.2} />
          <span>Caută</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bookings')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors ${
            activeTab === 'bookings' ? 'text-brandBlue' : 'text-slate-400 hover:text-brandDark'
          }`}
        >
          <Calendar size={20} strokeWidth={2.2} />
          <span>Rezervări</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors ${
            activeTab === 'profile' ? 'text-brandBlue' : 'text-slate-400 hover:text-brandDark'
          }`}
        >
          <User size={20} strokeWidth={2.2} />
          <span>Profil</span>
        </button>
      </nav>
    </div>
  );
}