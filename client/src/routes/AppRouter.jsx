/* ── AppRouter ──
   Routes all 14 pages with lazy loading, Suspense, and layout nesting.
   Auth guards (ProtectedRoute, AdminRoute) are pass-through placeholders
   until PR 14 wires them to Redux auth state.

   Structure:
     Public routes       → no layout
     Protected routes    → ProtectedRoute → MainLayout → <Outlet />
     Admin routes        → ProtectedRoute → MainLayout → AdminRoute → <Outlet />
     404 catch-all       → NotFound
*/

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Spinner from '../components/ui/Spinner';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

/* ── Lazy-loaded page components ── */
const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const AllMatches = lazy(() => import('../pages/AllMatches'));
const MatchView = lazy(() => import('../pages/MatchView'));
const Players = lazy(() => import('../pages/Players'));
const PlayerProfile = lazy(() => import('../pages/PlayerProfile'));
const OpeningsExplorer = lazy(() => import('../pages/OpeningsExplorer'));
const Analytics = lazy(() => import('../pages/Analytics'));
const AdminPanel = lazy(() => import('../pages/AdminPanel'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const NotFound = lazy(() => import('../pages/NotFound'));

/* ── Suspense fallback: centered gold spinner ── */
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base">
      <Spinner size="lg" />
    </div>
  );
}

/* ── Router tree ── */
export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public routes (no layout) ── */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Protected routes (auth guard + MainLayout) ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/matches" element={<AllMatches />} />
            <Route path="/matches/:id" element={<MatchView />} />
            <Route path="/players" element={<Players />} />
            <Route path="/players/:username" element={<PlayerProfile />} />
            <Route path="/openings" element={<OpeningsExplorer />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />

            {/* ── Admin routes (double guard) ── */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Route>
        </Route>

        {/* ── 404 catch-all ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
