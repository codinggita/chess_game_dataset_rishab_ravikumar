import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import Breadcrumb from '../ui/Breadcrumb';

/* ── Topbar per CHESSIQ-FRONTEND-PRD.md (§9 / PR 12) ──
   56px, bg-surface, border-bottom
   Left: hamburger (mobile) + Breadcrumb
   Right: search (240px), notification bell, avatar dropdown
*/

export default function Topbar({
  breadcrumbs = [],
  userName = 'Player',
  userRole = 'user',
  onNavigate,
  onMenuToggle,
  className,
  ...props
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const handleNavigate = (path) => {
    setDropdownOpen(false);
    onNavigate?.(path);
  };

  return (
    <header
      className={clsx(
        'fixed top-0 right-0 z-20 flex h-14 items-center justify-between border-b border-border-subtle bg-bg-surface px-6',
        'left-0 lg:left-[220px]',
        className,
      )}
      {...props}
    >
      {/* ── Left: hamburger + breadcrumb ── */}
      <div className="flex items-center gap-3">
        {/* Hamburger — visible only on mobile */}
        <button
          onClick={onMenuToggle}
          className="flex h-8 w-8 items-center justify-center rounded-[4px] text-text-secondary hover:bg-bg-elevated hover:text-text-primary lg:hidden"
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
          </svg>
        </button>
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* ── Right: search + bell + avatar ── */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-text-tertiary">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="h-[34px] w-[240px] rounded-[4px] border border-border-subtle bg-bg-input pl-8 pr-3 text-[13px] text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-gold-primary"
          />
        </div>

        {/* Notification bell */}
        <button className="flex h-8 w-8 items-center justify-center rounded-[4px] text-text-secondary hover:bg-bg-elevated hover:text-text-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* Avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-primary text-[12px] font-bold text-[#0B0B0E] hover:brightness-110 transition-all"
            aria-label="User menu"
          >
            {userName.charAt(0).toUpperCase()}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-[180px] rounded-[6px] border border-border-strong bg-bg-elevated py-1 shadow-[0_4px_20px_rgba(0,0,0,0.4)] z-50">
              <div className="border-b border-border-subtle px-4 py-2.5">
                <p className="text-[13px] font-medium text-text-primary truncate">{userName}</p>
                <span className="text-[11px] text-text-tertiary">
                  {userRole === 'admin' ? 'Administrator' : 'User'}
                </span>
              </div>
              <button
                onClick={() => handleNavigate('/profile')}
                className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
              >
                👤 Profile
              </button>
              <button
                onClick={() => handleNavigate('/settings')}
                className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
              >
                ⚙ Settings
              </button>
              <div className="border-t border-border-subtle mt-1 pt-1">
                <button
                  onClick={() => handleNavigate('/logout')}
                  className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-data-negative hover:bg-bg-hover transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
