/* ── ProtectedRoute ──
   Route guard that checks Redux auth state.
   - isLoading → full-page centered Spinner (while checkAuth resolves)
   - Not authenticated → Navigate to /login with return path in state
   - Authenticated → render child <Outlet />
*/

import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  /* ── Still validating stored token on mount ── */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-base">
        <Spinner size="lg" />
      </div>
    );
  }

  /* ── Not logged in → redirect to login with return path ── */
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  /* ── Authenticated → render child routes ── */
  return <Outlet />;
}
