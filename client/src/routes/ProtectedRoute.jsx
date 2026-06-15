/* ── ProtectedRoute ──
   Placeholder: passes through to children.
   PR 14 will wire this to Redux auth.isAuthenticated:
     - Not authenticated → <Navigate to="/login" state={{ from }} />
     - isLoading → full-page Spinner
     - Authenticated → <Outlet />
*/

import { Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  return <Outlet />;
}
