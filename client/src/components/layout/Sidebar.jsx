import clsx from 'clsx';

/* ── Sidebar Navigation per CHESSIQ-FRONTEND-PRD.md (§9 / PR 11) ──
   Fixed left, 220px, full height, bg-secondary
   Logo: 64px, knight icon, "ChessIQ" display font
   Nav: 5 flat items (Dashboard, Matches, Players, Openings, Analytics)
   Admin: 6th item if user is admin
   Active: gold left border 2px + gold glow bg + gold text
   User card: 56px pinned bottom, 36px avatar initials
   Collapse: 56px width, icons only, tooltips
   Mobile: hidden on <1024px, overlay when mobileOpen is true
*/

const NAV_ITEMS = [
  { icon: '\u2654', label: 'Dashboard', path: '/dashboard', admin: false },
  { icon: '\u265C', label: 'Matches', path: '/matches', admin: false },
  { icon: '\u265F', label: 'Players', path: '/players', admin: false },
  { icon: '\u265B', label: 'Openings', path: '/openings', admin: false },
  { icon: '\u265D', label: 'Analytics', path: '/analytics', admin: false },
  { icon: '\u2699', label: 'Admin', path: '/admin', admin: true },
];

export default function Sidebar({
  activePath = '/dashboard',
  userRole = 'user',
  userName = 'Player',
  collapsed = false,
  mobileOpen = false,
  onMobileClose,
  onNavigate,
  className,
  ...props
}) {
  const isAdmin = userRole === 'admin';
  const visibleItems = NAV_ITEMS.filter((item) => !item.admin || isAdmin);

  return (
    <>
      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-[rgba(0,0,0,0.6)] lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          'fixed left-0 top-0 z-40 flex flex-col bg-bg-secondary border-r border-border-subtle transition-all duration-200',
          collapsed ? 'w-[56px]' : 'w-[220px]',
          'h-full',
          /* Mobile: hidden by default, shown when mobileOpen */
          'hidden lg:flex',
          mobileOpen && '!flex',
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

        {/* ── Logo section: 64px ── */}
        <div
          className={clsx(
            'relative z-10 flex items-center gap-[10px] border-b border-border-subtle h-16 px-5',
            collapsed && 'justify-center px-0',
          )}
        >
          <div className="relative flex h-11 w-11 items-center justify-center flex-shrink-0">
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
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-[16px] font-semibold leading-tight text-gold-primary" style={{ fontFamily: 'var(--font-family-display)' }}>
                ChessIQ
              </span>
              <span className="text-[12px] leading-tight text-text-tertiary">Analytics</span>
            </div>
          )}
        </div>

        {/* ── Navigation: flat items, 40px each ── */}
        <nav className="relative z-10 flex-1 overflow-y-auto py-3">
          <div className="flex flex-col gap-1">
            {visibleItems.map((item) => {
              const isActive = activePath === item.path || activePath.startsWith(item.path + '/');

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate?.(item.path);
                    onMobileClose?.();
                  }}
                  title={collapsed ? item.label : undefined}
                  className={clsx(
                    'group flex items-center h-10 text-[14px] transition-all duration-150',
                    collapsed
                      ? 'justify-center mx-auto w-10 rounded-[4px]'
                      : 'w-[calc(100%-16px)] mx-2 gap-3 px-4',
                    isActive
                      ? 'bg-gold-primary/8 text-gold-primary'
                      : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
                    collapsed
                      ? ''
                      : (isActive ? 'border-l-2 border-gold-primary ml-[6px]' : 'border-l-2 border-transparent ml-2'),
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={clsx(
                    'transition-transform duration-150 group-hover:translate-x-[3px] flex-shrink-0',
                    collapsed ? 'text-lg' : 'text-base',
                  )}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="transition-transform duration-150 group-hover:translate-x-[3px]">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* ── User card: 56px pinned bottom ── */}
        <div
          className={clsx(
            'relative z-10 border-t border-border-subtle bg-bg-secondary',
            collapsed ? 'p-2' : 'p-4',
          )}
        >
          <div
            className={clsx(
              'flex items-center',
              collapsed ? 'justify-center' : 'gap-3 px-2',
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-primary text-[13px] font-bold text-[#0B0B0E] flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[13px] font-medium text-text-primary">{userName}</p>
                  <span
                    className={clsx(
                      'inline-block rounded-sm px-1.5 py-[1px] text-[10px] font-semibold uppercase tracking-[0.05em]',
                      userRole === 'admin'
                        ? 'border border-gold-primary/40 text-gold-primary'
                        : 'border border-border-strong text-text-tertiary',
                    )}
                  >
                    {userRole === 'admin' ? 'ADMIN' : 'USER'}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate?.('/profile')}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary transition-colors hover:text-text-primary"
                  aria-label="Profile"
                >
                  ⚙
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
