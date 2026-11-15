import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/endpoints';
import { keys } from '@/api/keys';

/** Sesiunea curentă a administratorului (cookie HttpOnly, citit prin GET /me). */
export function useSession() {
  return useQuery({
    queryKey: keys.session,
    queryFn: () => api.auth.me(),
    retry: false,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
