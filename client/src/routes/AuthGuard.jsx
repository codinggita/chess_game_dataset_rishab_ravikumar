/* ── AuthGuard ──
   Guest-only route guard for /login and /register.
   If user is already authenticated → redirect to /dashboard.
   Otherwise → render child route (<Outlet />).
*/

import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function AuthGuard() {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return null; // spinner handled by ProtectedRoute; flash-safe
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
