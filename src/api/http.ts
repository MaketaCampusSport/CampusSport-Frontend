import i18n from '@/i18n';
import { API_BASE } from './config';

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type QueryValue = string | number | boolean | null | undefined;
export type Query = Record<string, QueryValue>;

interface RequestOptions {
  query?: Query;
  body?: unknown;
  form?: FormData;
  signal?: AbortSignal;
}

let unauthorizedHandler: (() => void) | null = null;

/** Înregistrat de aplicație: ce se întâmplă când serverul răspunde 401 (sesiune expirată). */
export function setUnauthorizedHandler(fn: (() => void) | null): void {
  unauthorizedHandler = fn;
}

function buildUrl(path: string, query?: Query): string {
  const params = new URLSearchParams();
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
    }
  }
  const qs = params.toString();
  return `${API_BASE}${path}${qs ? `?${qs}` : ''}`;
}

/** Erorile serverului au mesaje în română și engleză (SDD 6.1) – alegem limba curentă. */
async function toApiError(res: Response): Promise<ApiError> {
  let code: string | undefined;
  let message = res.statusText || `HTTP ${res.status}`;
  let details: unknown;
  try {
    const data = (await res.json()) as {
      code?: string;
      message?: string | { ro?: string; en?: string };
      details?: unknown;
    };
    code = data.code;
    details = data.details;
    if (typeof data.message === 'string') message = data.message;
    else if (data.message) {
      const lang = i18n.language?.startsWith('en') ? 'en' : 'ro';
      message = data.message[lang] ?? data.message.ro ?? data.message.en ?? message;
    }
  } catch {
    /* corp non-JSON */
  }
  return new ApiError(res.status, message, code, details);
}

async function send(method: string, path: string, opts: RequestOptions = {}): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Accept-Language': i18n.language?.startsWith('en') ? 'en' : 'ro',
  };
  let body: BodyInit | undefined;
  if (opts.form) {
    body = opts.form;
  } else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path, opts.query), {
      method,
      headers,
      body,
      signal: opts.signal,
      // JWT-ul stă într-un cookie HttpOnly / Secure / SameSite=Strict (SDD 8.1).
      credentials: 'include',
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause;
    throw new ApiError(0, i18n.t('errors.network'), 'NETWORK');
  }

  if (!res.ok) {
    if (res.status === 401) unauthorizedHandler?.();
    throw await toApiError(res);
  }
  return res;
}

async function json<T>(method: string, path: string, opts?: RequestOptions): Promise<T> {
  const res = await send(method, path, opts);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const http = {
  get: <T>(path: string, query?: Query, signal?: AbortSignal) => json<T>('GET', path, { query, signal }),
  post: <T>(path: string, body?: unknown, query?: Query) => json<T>('POST', path, { body, query }),
  put: <T>(path: string, body?: unknown) => json<T>('PUT', path, { body }),
  patch: <T>(path: string, body?: unknown) => json<T>('PATCH', path, { body }),
  delete: <T = void>(path: string) => json<T>('DELETE', path),
  upload: <T>(path: string, form: FormData) => json<T>('POST', path, { form }),
  /** Descărcare de fișiere (export CSV/PDF). */
  async blob(path: string, query?: Query): Promise<Blob> {
    const res = await send('GET', path, { query });
    return res.blob();
  },
};
