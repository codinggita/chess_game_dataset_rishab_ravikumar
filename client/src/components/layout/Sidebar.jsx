import clsx from 'clsx';

/* ── Sidebar Navigation per design.md spec ──
   Fixed left, 220px, full height, bg-surface
   Logo + gold glow, nav groups, user card pinned bottom
   Active: gold left border 2px + gold glow bg
   Hover: icon slides 3px right, 150ms
*/

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ icon: '\u2654', label: 'Dashboard', path: '/', admin: false }],
  },
  {
    label: 'Matches',
    items: [
      { icon: '\u265C', label: 'All Matches', path: '/matches', admin: false },
      { icon: '\u265D', label: 'Analytics', path: '/matches/analytics', admin: false },
      { icon: '\u26A1', label: 'Filters', path: '/matches/filters', admin: false },
    ],
  },
  {
    label: 'Players',
    items: [
      { icon: '\u265F', label: 'Players', path: '/players', admin: false },
      { icon: '\uD83D\uDCCA', label: 'Leaderboard', path: '/leaderboard', admin: false },
    ],
  },
  {
    label: 'Openings',
    items: [
      { icon: '\u265B', label: 'Openings', path: '/openings', admin: false },
      { icon: '\uD83D\uDD0D', label: 'ECO Explorer', path: '/openings/eco', admin: false },
    ],
  },
  {
    label: 'System',
    admin: true,
    items: [
      { icon: '\u2699', label: 'Admin Panel', path: '/admin', admin: true },
      { icon: '\uD83D\uDC65', label: 'Users', path: '/admin/users', admin: true },
      { icon: '\uD83D\uDDA5', label: 'System Health', path: '/admin/health', admin: true },
      { icon: '\uD83D\uDCCB', label: 'Logs', path: '/admin/logs', admin: true },
    ],
  },
  {
    label: 'User',
    items: [
      { icon: '\uD83D\uDCBE', label: 'Saved Matches', path: '/saved', admin: false },
      { icon: '\uD83D\uDC64', label: 'Profile', path: '/profile', admin: false },
      { icon: '\uD83D\uDEAA', label: 'Logout', path: '/logout', admin: false },
    ],
  },
];

export default function Sidebar({
  activePath = '/',
  userRole = 'user',
  userName = 'Player',
  onNavigate,
  className,
  ...props
}) {
  const isAdmin = userRole === 'admin';

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 z-40 flex h-full w-[220px] flex-col bg-bg-surface border-r border-border-default',
        className,
      )}
      {...props}
    >
      {/* ── Subtle vertical stripe texture ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 9px, rgba(255,255,255,0.01) 9px, rgba(255,255,255,0.01) 10px)',
        }}
      />

      {/* ── Logo section ── */}
      <div className="relative z-10 flex h-20 items-center gap-[10px] border-b border-[#1E1E28] px-5">
        {/* Gold radial glow behind knight */}
        <div className="relative flex h-11 w-11 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
            }}
          />
          {/* SVG chess knight — 28px gold (Tabler Icons, MIT) */}
          <svg className="relative z-10" width="28" height="28" viewBox="0 0 24 24" fill="#C9A84C">
            <path d="M8.959 1.99l-.147.028-.115.029a1 1 0 0 0-.646 1.27l.749 2.245-2.815 1.735a2 2 0 0 0-.655 2.751l.089.133a2 2 0 0 0 1.614.819l1.563-.001-1.614 4.674a1 1 0 0 0 .945 1.327h7.961a1 1 0 0 0 1-.978l.112-5c0-3.827-1.555-6.878-4.67-7.966l-2.399-.83-.375-.121-.258-.074-.135-.031-.101-.013-.055-.001-.048.003z" />
            <path d="M18 18h-12a1 1 0 0 0-1 1 2 2 0 0 0 2 2h10a2 2 0 0 0 1.987-1.768l.011-.174a1 1 0 0 0-.998-1.058z" />
          </svg>
        </div>
        {/* Wordmark — stacked vertically */}
        <div className="flex flex-col">
          <span className="text-[16px] font-semibold leading-tight text-accent-gold">ChessIQ</span>
          <span className="text-[12px] leading-tight text-text-tertiary">Analytics</span>
        </div>
      </div>

      {/* ── Navigation groups ── */}
      <nav className="relative z-10 flex-1 overflow-y-auto">
        {NAV_GROUPS.map((group, idx) => {
          const isAdminGroup = group.admin;
          if (isAdminGroup && !isAdmin) {
            // Show as locked for non-admin users
            return (
              <div key={group.label}>
                <p
                  className={clsx(
                    'px-5 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-text-tertiary',
                    idx === 0 ? 'pt-4' : 'pt-5',
                  )}
                >
                  {group.label}
                </p>
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <div
                      key={item.path}
                      className="relative mx-2 flex h-10 items-center gap-3 rounded-[4px] px-4 text-[14px] text-text-tertiary/50 cursor-not-allowed"
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                      <span
                        className="ml-auto text-[10px] opacity-50"
                        title="Admin access required"
                      >
                        🔒
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          const visibleItems = group.items;

          return (
            <div key={group.label}>
              <p
                className={clsx(
                  'px-5 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-text-tertiary',
                  idx === 0 ? 'pt-4' : 'pt-5',
                )}
              >
                {group.label}
              </p>
              <div className="flex flex-col gap-1">
                {visibleItems.map((item) => {
                  const isActive = activePath === item.path;

                  return (
                    <button
                      key={item.path}
                      onClick={() => onNavigate?.(item.path)}
                      className={clsx(
                        'group relative mx-2 flex h-10 w-[calc(100%-16px)] items-center gap-3 rounded-[4px] px-4 text-[14px] transition-all duration-150',
                        isActive
                          ? 'bg-accent-gold/8 text-accent-gold'
                          : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
                        'border-l-2',
                        isActive ? 'border-accent-gold ml-[6px]' : 'border-transparent ml-2',
                      )}
                    >
                      <span className="transition-transform duration-150 group-hover:translate-x-[3px]">
                        {item.icon}
                      </span>
                      <span className="transition-transform duration-150 group-hover:translate-x-[3px]">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* ── User card ── */}
      <div className="relative z-10 border-t border-[#252530] bg-[#0B0B0E] p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-gold text-[12px] font-bold text-[#0B0B0E]">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[13px] font-medium text-text-primary">{userName}</p>
            <span
              className={clsx(
                'inline-block rounded-sm px-1.5 py-[1px] text-[10px] font-semibold uppercase tracking-[0.05em]',
                userRole === 'admin'
                  ? 'border border-accent-gold/40 text-accent-gold'
                  : 'border border-[#35354A] text-text-tertiary',
              )}
            >
              {userRole === 'admin' ? 'ADMIN' : 'USER'}
            </span>
          </div>
          <button
            onClick={() => onNavigate?.('/profile')}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary transition-colors hover:text-text-primary"
            aria-label="Settings"
          >
            ⚙
          </button>
        </div>
      </div>
    </aside>
  );
}
