/* ── useAuth ──
   Convenience hook that reads Redux auth state.
   Returns { user, token, isAuthenticated, isAdmin, isLoading }.
*/

import { useSelector } from 'react-redux';

export function useAuth() {
  const { user, token, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';
  return { user, token, isAuthenticated, isAdmin, isLoading };
}
