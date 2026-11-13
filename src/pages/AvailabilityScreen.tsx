import { useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import {
  AVAILABLE_DAYS,
  SelectedSlotSummary,
  SPORT_LABELS,
  SPORT_RESOURCES,
  SlotStatus,
  TimeSlotItem,
} from '../data/availabilityMockData';

interface AvailabilityScreenProps {
  sportId: string;
  onBack: () => void;
  onContinue?: (selection: SelectedSlotSummary) => void;
}

type EnvironmentFilter = 'Toate' | 'Interior' | 'Exterior';

/**
 * Availability Screen (MAKETA-69 / UI-03):
 * Matches UI Design page 17 and component states on page 37:
 * - Step header "01/03 TEREN + ORĂ" with back navigation & environment filters
 * - Horizontal scrollable day strip
 * - Resource cards with horizontal scrollable 2-row slot grid & "Mai multe ore" toggle
 * - Sticky bottom selection summary + "Continuă" CTA
 */
export default function AvailabilityScreen({
  sportId,
  onBack,
  onContinue,
}: AvailabilityScreenProps) {
  const [selectedDayId, setSelectedDayId] = useState<string>(AVAILABLE_DAYS[0].id);
  const [envFilter, setEnvFilter] = useState<EnvironmentFilter>('Toate');
  const [selectedSlotKey, setSelectedSlotKey] = useState<string | null>(null);
  const [expandedResources, setExpandedResources] = useState<Record<string, boolean>>({});

  const sportName = SPORT_LABELS[sportId] ?? 'Sport';

  const filteredResources = useMemo(() => {
    return SPORT_RESOURCES.filter((res) => {
      if (res.sportId !== sportId) return false;
      if (envFilter !== 'Toate' && res.environment !== envFilter) return false;
      return true;
    });
  }, [sportId, envFilter]);

  const activeDay = useMemo(
    () => AVAILABLE_DAYS.find((d) => d.id === selectedDayId) ?? AVAILABLE_DAYS[0],
    [selectedDayId]
  );

  // Resolve currently selected slot details for the sticky bottom bar
  const selectedSummary = useMemo<SelectedSlotSummary | null>(() => {
    if (!selectedSlotKey) return null;

    for (const resource of filteredResources) {
      const slots = resource.slotsByDay[selectedDayId] ?? [];
      const found = slots.find((slot) => `${resource.id}::${slot.id}` === selectedSlotKey);
      if (found && found.status === 'free') {
        return {
          sportId,
          sportName,
          resourceId: resource.id,
          resourceName: resource.name,
          location: resource.location,
          dayId: activeDay.id,
          dayLabel: activeDay.fullLabel,
          slotId: found.id,
          time: found.time,
          endTime: found.endTime,
        };
      }
    }
    return null;
  }, [selectedSlotKey, filteredResources, selectedDayId, sportId, sportName, activeDay]);

  const handleDayChange = (dayId: string) => {
    setSelectedDayId(dayId);
    setSelectedSlotKey(null);
  };

  const handleToggleExpand = (resourceId: string) => {
    setExpandedResources((prev) => ({
      ...prev,
      [resourceId]: !prev[resourceId],
    }));
  };

  const getSlotStyles = (status: SlotStatus, isSelected: boolean) => {
    if (isSelected) {
      return {
        container:
          'bg-brandYellow border-2 border-brandDark text-brandDark shadow-xs',
        label: 'Selectat ✓',
        labelClass: 'text-brandDark font-bold',
        disabled: false,
      };
    }

    switch (status) {
      case 'free':
        return {
          container:
            'bg-white border border-slate-200 hover:border-brandBlue text-brandDark',
          label: 'Liber',
          labelClass: 'text-slate-500 font-medium',
          disabled: false,
        };
      case 'my_booking':
        return {
          container: 'bg-brandBlue border border-brandBlue text-white',
          label: 'Rezervarea mea',
          labelClass: 'text-white/90 font-semibold',
          disabled: true,
        };
      case 'pe_class':
        return {
          container: 'bg-amber-50 border border-amber-200/80 text-amber-900',
          label: 'Curs EF',
          labelClass: 'text-amber-700 font-semibold',
          disabled: true,
        };
      case 'occupied':
      default:
        return {
          container: 'bg-slate-100 border border-transparent text-slate-400',
          label: 'Ocupat',
          labelClass: 'text-slate-400 font-medium',
          disabled: true,
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-between max-w-md mx-auto shadow-xs border-x border-slate-200/70">
      {/* Top Header & Day Strip */}
      <header className="bg-white border-b border-slate-200/80 pt-4 pb-3 px-4 sticky top-0 z-20">
        {/* Step Progress Row */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="Înapoi la alegerea sportului"
            className="w-11 h-11 min-w-[44px] min-h-[44px] -ml-2 rounded-full hover:bg-slate-100 flex items-center justify-center text-brandDark transition-colors"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>

          <span className="text-[11px] font-bold uppercase tracking-widest text-brandBlue">
            01/03 TEREN + ORĂ
          </span>

          <span className="text-xs font-bold text-slate-400">CampusSport</span>
        </div>

        {/* Sport Title + Environment Filter Pills */}
        <div className="flex items-center justify-between gap-2 mt-1">
          <h1 className="font-condensed text-3xl font-bold uppercase tracking-wide text-brandDark">
            {sportName}
          </h1>

          <div
            className="flex items-center gap-1.5"
            role="group"
            aria-label="Filtrare după tipul spațiului"
          >
            {(['Toate', 'Interior', 'Exterior'] as EnvironmentFilter[]).map((filter) => {
              const isActive = envFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setEnvFilter(filter);
                    setSelectedSlotKey(null);
                  }}
                  aria-pressed={isActive}
                  className={`min-h-[36px] px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-brandDark text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Horizontal Scrollable Day Selector Strip (UI-03) */}
        <div
          className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 -mx-1 px-1 no-scrollbar"
          role="tablist"
          aria-label="Alege ziua"
        >
          {AVAILABLE_DAYS.map((day) => {
            const isSelected = day.id === selectedDayId;
            return (
              <button
                key={day.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleDayChange(day.id)}
                className={`min-w-[58px] min-h-[60px] rounded-2xl px-2.5 py-2 flex flex-col items-center justify-center shrink-0 transition-all ${
                  isSelected
                    ? 'bg-brandBlue text-white shadow-xs'
                    : 'bg-slate-100/80 text-brandDark hover:bg-slate-200/70'
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isSelected ? 'text-white/90' : 'text-slate-400'
                  }`}
                >
                  {day.dayShort}
                </span>
                <span className="font-condensed text-xl font-bold leading-tight mt-0.5">
                  {day.dayNumber}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content: Resource Cards + Horizontal Scrollable Slot Grids */}
      <main className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            ALEGE TERENUL ȘI ORA
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {filteredResources.length}{' '}
            {filteredResources.length === 1 ? 'teren' : 'terenuri'}
          </span>
        </div>

        {filteredResources.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-100">
            <p className="text-sm font-bold text-brandDark">
              Niciun teren disponibil pentru filtrul „{envFilter}”
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Schimbă filtrul de sus în „Toate” pentru a vedea toate resursele pentru{' '}
              {sportName}.
            </p>
          </div>
        ) : (
          filteredResources.map((resource) => {
            const allSlots = resource.slotsByDay[selectedDayId] ?? [];
            const isExpanded = Boolean(expandedResources[resource.id]);
            const visibleSlots: TimeSlotItem[] = isExpanded
              ? allSlots
              : allSlots.slice(0, 6);

            return (
              <section
                key={resource.id}
                aria-label={resource.name}
                className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100"
              >
                {/* Resource Card Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-brandDark leading-tight">
                      {resource.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      {resource.location} · {resource.environment} ·{' '}
                      {resource.surfaceOrDetails}
                    </p>
                  </div>

                  {allSlots.length > 6 && (
                    <button
                      type="button"
                      onClick={() => handleToggleExpand(resource.id)}
                      className="min-h-[36px] text-xs font-bold text-brandBlue hover:underline shrink-0 px-1"
                    >
                      {isExpanded ? 'Restrânge' : 'Mai multe ore'}
                    </button>
                  )}
                </div>

                {/* UI-03: Horizontal Scrollable 2-Row Slot Grid */}
                <div
                  className="grid grid-rows-2 grid-flow-col auto-cols-[minmax(108px,1fr)] gap-2 overflow-x-auto pb-1"
                  role="group"
                  aria-label={`Sloturi orare pentru ${resource.name}`}
                >
                  {visibleSlots.map((slot) => {
                    const compositeKey = `${resource.id}::${slot.id}`;
                    const isSelected = selectedSlotKey === compositeKey;
                    const styles = getSlotStyles(slot.status, isSelected);

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={styles.disabled}
                        aria-pressed={isSelected}
                        onClick={() =>
                          setSelectedSlotKey((prev) =>
                            prev === compositeKey ? null : compositeKey
                          )
                        }
                        // UI-05: minimum 44px touch target height
                        className={`min-h-[54px] rounded-xl px-3 py-2 text-left flex flex-col justify-center transition-all ${
                          styles.container
                        } ${
                          styles.disabled
                            ? 'cursor-not-allowed'
                            : 'active:scale-[0.97] cursor-pointer'
                        }`}
                      >
                        <span className="text-sm font-extrabold leading-tight">
                          {slot.time}
                        </span>
                        <span className={`text-[11px] mt-0.5 ${styles.labelClass}`}>
                          {styles.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* Sticky Bottom Summary & Primary CTA (UI Design page 17) */}
      <footer className="bg-white border-t border-slate-200/80 px-4 py-3.5 shrink-0">
        <p className="text-center text-xs font-semibold text-slate-600 mb-2.5">
          {selectedSummary ? (
            <>
              <span className="text-brandDark font-bold">
                {selectedSummary.dayLabel}
              </span>{' '}
              ·{' '}
              <span className="text-brandDark font-bold">
                {selectedSummary.time}
              </span>{' '}
              ·{' '}
              <span className="text-brandDark font-bold">
                {selectedSummary.resourceName}
              </span>
            </>
          ) : (
            'Selectează o oră liberă pentru a continua'
          )}
        </p>

        <button
          type="button"
          disabled={!selectedSummary}
          onClick={() => selectedSummary && onContinue?.(selectedSummary)}
          className={`w-full min-h-[48px] rounded-2xl font-bold text-[15px] transition-colors ${
            selectedSummary
              ? 'bg-brandYellow hover:bg-yellow-400 text-brandDark shadow-xs cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Continuă
        </button>
      </footer>
    </div>
  );
}