/* ── AdminRoute ──
   Route guard for /admin pages.
   Checks auth.user.role === 'admin'.
   - Not admin → toast "Admin access required" + Navigate to /dashboard
   - Admin → render child <Outlet />
*/

import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    /* Defer toast import — only shown when non-admin hits /admin */
    import('../components/ui').then(({ showToast }) => {
      showToast('Admin access required', 'error');
    });
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
