/* ── ChessIQ Route Configuration ──
   All 14 routes
   Used by AppRouter.jsx for route generation
*/

export const routes = [
  {
    path: '/',
    component: 'Landing',
    auth: false,
    title: 'ChessIQ Analytics — Every move tells a story',
  },
  {
    path: '/login',
    component: 'Login',
    auth: false,
    guest: true,
    title: 'Sign In — ChessIQ Analytics',
  },
  {
    path: '/register',
    component: 'Register',
    auth: false,
    guest: true,
    title: 'Create Account — ChessIQ Analytics',
  },
  {
    path: '/dashboard',
    component: 'Dashboard',
    auth: true,
    title: 'Dashboard — ChessIQ Analytics',
  },
  {
    path: '/matches',
    component: 'AllMatches',
    auth: true,
    title: 'Matches — ChessIQ Analytics',
  },
  {
    path: '/matches/:id',
    component: 'MatchView',
    auth: true,
    title: 'Match View — ChessIQ Analytics',
  },
  {
    path: '/players',
    component: 'Players',
    auth: true,
    title: 'Players — ChessIQ Analytics',
  },
  {
    path: '/players/:username',
    component: 'PlayerProfile',
    auth: true,
    title: 'Player Profile — ChessIQ Analytics',
  },
  {
    path: '/openings',
    component: 'OpeningsExplorer',
    auth: true,
    title: 'Openings Explorer — ChessIQ Analytics',
  },
  {
    path: '/analytics',
    component: 'Analytics',
    auth: true,
    title: 'Analytics — ChessIQ Analytics',
  },
  {
    path: '/admin',
    component: 'AdminPanel',
    auth: true,
    admin: true,
    title: 'Admin Panel — ChessIQ Analytics',
  },
  {
    path: '/profile',
    component: 'Profile',
    auth: true,
    title: 'Profile — ChessIQ Analytics',
  },
  {
    path: '/settings',
    component: 'Settings',
    auth: true,
    title: 'Settings — ChessIQ Analytics',
  },
  {
    path: '*',
    component: 'NotFound',
    auth: false,
    title: 'Page Not Found — ChessIQ Analytics',
  },
];
