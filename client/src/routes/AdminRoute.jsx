/* ── AdminRoute ──
   Placeholder: passes through to children.
   PR 14 will check auth.user.role === 'admin':
     - Not admin → toast "Admin access required" + redirect /dashboard
     - Admin → <Outlet />
*/

import { Outlet } from 'react-router-dom';

export default function AdminRoute() {
  return <Outlet />;
}
