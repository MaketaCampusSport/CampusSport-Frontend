/**
 * Tipurile EXACT cum le trimite backend-ul (snake_case), după `livrabil05/openapi.yaml`.
 * Se folosesc doar în `mappers.ts` și `real.ts`; restul aplicației lucrează cu tipurile din `types.ts` (camelCase).
 * Când rulezi `npm run api:generate`, le poți înlocui cu tipurile generate.
 */

export interface BUser {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: 'student' | 'teacher' | 'external' | 'admin';
  status: 'active' | 'suspended';
  suspended_until?: string | null;
  created_at?: string;
}

export interface BSession {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  user: BUser;
}

export interface BPage<T> {
  page: number;
  page_size: number;
  total: number;
  items: T[];
}

export interface BSport {
  id: string;
  name_ro: string;
  name_en: string;
  icon: string;
  required_equipment: string[];
}

export interface BTimeRange {
  open: string;
  close: string;
}
export type BDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type BWeeklyHours = Partial<Record<BDay, BTimeRange[]>>;

export interface BResource {
  id: string;
  name?: string;
  type?: string;
  location?: string;
  photo_url?: string | null;
  capacity?: number;
  equipment?: string[];
  sport_ids?: string[];
  opening_hours?: BWeeklyHours;
  slot_minutes?: number;
  external_access?: 'never' | 'window' | 'leftover';
  external_access_windows?: BWeeklyHours;
  active?: boolean;
}

export type BBlockKind = 'pe_class' | 'event' | 'maintenance' | 'emergency';

export interface BBlock {
  id: string;
  resource_id: string;
  kind: BBlockKind;
  start: string;
  end?: string | null;
  reason: string;
  recurrence_id?: string | null;
  created_by: string;
}

export interface BBlockResult {
  block: BBlock;
  cancelled_bookings_count: number;
  superseded_blocks_count?: number;
  notified_users_count: number;
}

export interface BDelivery {
  notified: number;
  delivered: number;
  failed: number;
  by_channel?: { push?: number; email?: number; sms?: number };
}

export interface BSettings {
  monthly_quota: number;
  monthly_quota_per_sport?: Record<string, number>;
  max_active_bookings: number;
  booking_window_days_student: number;
  booking_window_days_teacher: number;
  booking_window_hours_external: number;
  cancel_free_hours: number;
  checkin_minutes_before: number;
  checkin_minutes_after: number;
  no_show_threshold: number;
  no_show_suspension_days: number;
  waitlist_offer_minutes: number;
  waitlist_simultaneous_under_hours: number;
  default_slot_minutes: number;
  member_replaces_external: boolean;
  updated_by?: string;
  updated_at?: string;
}

export interface BAuditEntry {
  id: string;
  actor_id: string;
  action: string;
  entity: string;
  entity_id?: string;
  before?: unknown;
  after?: unknown;
  at: string;
}

export interface BSlot {
  start: string;
  end: string;
  status: 'free' | 'occupied' | 'mine' | 'blocked';
  bookable: boolean;
  block_kind?: BBlockKind;
  booking_id?: string;
}

export interface BResourceAvailability {
  resource_id: string;
  resource_name: string;
  slots: BSlot[];
}

export interface BAvailability {
  date: string;
  resources: BResourceAvailability[];
}

export interface BDashboard extends BAvailability {
  check_ins_count: number;
  no_shows_count: number;
}