import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/* ── MainLayout per CHESSIQ-FRONTEND-PRD.md (§9 / PR 12) ──
   Sidebar (fixed) + Topbar (sticky) + content via <Outlet />
   Content: 24px padding, 12-column grid
   Responsive: <1024px sidebar becomes overlay with hamburger
*/

export default function MainLayout({
  userRole = 'user',
  userName = 'Player',
  breadcrumbs = [],
  activePath = '/dashboard',
  onNavigate,
  children,
  className,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (path) => {
    onNavigate?.(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-bg-base">
      {/* ── Sidebar (handles desktop fixed + mobile overlay) ── */}
      <Sidebar
        activePath={activePath}
        userRole={userRole}
        userName={userName}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* ── Topbar ── */}
      <Topbar
        breadcrumbs={breadcrumbs}
        userName={userName}
        userRole={userRole}
        onNavigate={handleNavigate}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
      />

      {/* ── Main content area ── */}
      <main
        className={clsx(
          'pt-14 min-h-screen',
          'ml-0 lg:ml-[220px]',
          className,
        )}
      >
        <div className="p-6">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
