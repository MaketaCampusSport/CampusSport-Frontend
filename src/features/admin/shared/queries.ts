import { useQuery } from '@tanstack/react-query';
import { USE_MOCKS } from '@/api/config';
import { api } from '@/api/endpoints';
import { keys } from '@/api/keys';
import type { Resource, Sport } from '@/api/types';
import i18n from '@/i18n';
import { EQUIPMENT_IDS } from '@/lib/validators';

export function useSports() {
  return useQuery({ queryKey: keys.sports, queryFn: () => api.catalog.sports(), staleTime: 5 * 60_000 });
}

export function useResources() {
  return useQuery({ queryKey: keys.resources, queryFn: () => api.catalog.resources() });
}

/** Numele unui sport în limba curentă. */
export function sportName(sport: Sport, lng: string): string {
  return lng.startsWith('en') ? sport.nameEn : sport.nameRo;
}

export function activeResources(list: Resource[] | undefined): Resource[] {
  return (list ?? []).filter((r) => r.active);
}

/**
 * Dotările alese în formulare.
 * - Demo (MSW): lista standard din front-end.
 * - Backend real: doar valorile existente pe server (cerute de sporturi sau puse pe resurse). Backend-ul are
 *   text liber („panou”, „fileu tenis”…); dacă am afișa și lista standard, ar apărea dubluri („Panouri” / „panou”).
 */
export function useEquipmentOptions(): string[] {
  const sports = useSports().data;
  const resources = useResources().data;
  const all = new Set<string>(USE_MOCKS ? EQUIPMENT_IDS : []);
  sports?.forEach((s) => s.requiredEquipment.forEach((e) => all.add(e)));
  resources?.forEach((r) => r.equipment.forEach((e) => all.add(e)));
  return [...all];
}

/** Eticheta dotării: traducerea din i18n dacă există, altfel textul primit de la server. */
export function equipmentLabel(id: string): string {
  return i18n.exists(`equipment.${id}`) ? i18n.t(`equipment.${id}`) : id;
}
