import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import Breadcrumb from '../ui/Breadcrumb';

/* ── Topbar per CHESSIQ-FRONTEND-PRD.md (§9 / PR 12) ──
   56px, bg-surface, border-bottom
   Left: hamburger (mobile) + Breadcrumb
   Right: search (240px lg+), notification bell, avatar dropdown
   Mobile (<1024px): search icon opens full-width bar below topbar
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileSearchRef = useRef(null);

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
    setMobileSearchOpen(false);
    onNavigate?.(path);
  };

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 right-0 z-20 flex h-14 items-center justify-between border-b border-border-subtle bg-bg-surface px-6',
          'left-0 lg:left-[220px]',
          className,
        )}
        {...props}
      >
        {/* ── Left: hamburger + breadcrumb ── */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuToggle}
            className="flex h-8 w-8 items-center justify-center rounded-[4px] text-text-secondary hover:bg-bg-elevated hover:text-text-primary lg:hidden flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
            </svg>
          </button>
          <div className="truncate">
            <Breadcrumb items={breadcrumbs} />
          </div>
        </div>

        {/* ── Right: search + bell + avatar ── */}
        <div className="flex items-center gap-3">
          {/* Search — desktop: always visible ≥1024px */}
          <div className="relative hidden lg:block">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-text-tertiary">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleNavigate(`/matches?search=${encodeURIComponent(e.target.value.trim())}`);
                }
              }}
              className="h-[34px] w-[240px] rounded-[4px] border border-border-subtle bg-bg-input pl-8 pr-3 text-[13px] text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-gold-primary"
            />
          </div>

          {/* Search icon — mobile only <1024px */}
          <button
            onClick={() => setMobileSearchOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-[4px] text-text-secondary hover:bg-bg-elevated hover:text-text-primary lg:hidden flex-shrink-0"
            aria-label="Toggle search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* Notification bell */}
          <button className="flex h-8 w-8 items-center justify-center rounded-[4px] text-text-secondary hover:bg-bg-elevated hover:text-text-primary flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* Avatar + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-primary text-[12px] font-bold text-[#0B0B0E] hover:brightness-110 transition-all flex-shrink-0"
              aria-label="User menu"
            >
              {userName.charAt(0).toUpperCase()}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-[180px] rounded-[6px] border border-border-strong bg-bg-elevated py-1 z-50">
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
                  Profile
                </button>
                <button
                  onClick={() => handleNavigate('/settings')}
                  className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
                >
                  Settings
                </button>
                <div className="border-t border-border-subtle mt-1 pt-1">
                  <button
                    onClick={() => handleNavigate('/logout')}
                    className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-data-negative hover:bg-bg-hover transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile search bar (full-width, below topbar) ── */}
      <div
        ref={mobileSearchRef}
        className={clsx(
          'fixed left-0 right-0 z-10 border-b border-border-subtle bg-bg-surface px-4 py-3 transition-all duration-200 lg:hidden',
          mobileSearchOpen ? 'top-14 opacity-100' : '-top-20 opacity-0 pointer-events-none',
        )}
      >
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-text-tertiary">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search matches, players, openings..."
            autoFocus={mobileSearchOpen}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                handleNavigate(`/matches?search=${encodeURIComponent(e.target.value.trim())}`);
              }
            }}
            className="w-full h-[38px] rounded-[4px] border border-border-subtle bg-bg-input pl-8 pr-3 text-[13px] text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-gold-primary"
          />
        </div>
      </div>
    </>
  );
}
