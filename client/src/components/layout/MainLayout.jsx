import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../store/slices/authSlice';

export default function MainLayout({
  children,
  className,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const activePath = location.pathname;
  const userName = user?.name || 'Player';
  const userRole = user?.role || 'user';

  // Derive breadcrumbs dynamically
  const pathParts = activePath.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, i) => {
    const to = '/' + pathParts.slice(0, i + 1).join('/');
    return {
      label: part.charAt(0).toUpperCase() + part.slice(1),
      path: to,
    };
  });

  const handleNavigate = (path) => {
    if (path === '/logout') {
      dispatch(logoutUser());
      return;
    }
    navigate(path);
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
