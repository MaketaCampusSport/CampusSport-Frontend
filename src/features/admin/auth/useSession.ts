import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/endpoints';
import { keys } from '@/api/keys';

/** Sesiunea curentă a administratorului: `GET /me` (cookie de refresh sau token Bearer). */
export function useSession() {
  return useQuery({
    queryKey: keys.session,
    queryFn: () => api.auth.me(),
    retry: false,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
