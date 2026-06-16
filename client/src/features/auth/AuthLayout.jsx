/* ── AuthLayout ──
   Shared split-screen layout for Login and Register pages.
   Left panel: chess texture background + floating decorative pieces + branding.
   Right panel: renders children (the form).
*/

const floatingPieces = [
  { symbol: '\u2654', size: 120, opacity: 0.08, top: '8%', left: '5%', delay: 0 },
  { symbol: '\u265B', size: 100, opacity: 0.06, top: '65%', left: '10%', delay: 1.5 },
  { symbol: '\u265C', size: 80, opacity: 0.05, top: '20%', right: '15%', delay: 0.8 },
  { symbol: '\u265E', size: 90, opacity: 0.07, top: '75%', right: '8%', delay: 2.2 },
  { symbol: '\u265D', size: 70, opacity: 0.04, top: '45%', left: '35%', delay: 0.3 },
];

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left Panel — 60% — Chess Art ── */}
      <div className="chess-bg chess-bg-auth relative hidden w-[60%] flex-col overflow-hidden p-10 lg:flex">
        {/* Floating decorative pieces */}
        {floatingPieces.map((piece, i) => (
          <span
            key={i}
            className="pointer-events-none absolute select-none text-gold-primary"
            style={{
              fontSize: piece.size,
              opacity: piece.opacity,
              filter: 'blur(1px)',
              top: piece.top,
              left: piece.left,
              right: piece.right,
              animation: `float 6s ease-in-out ${piece.delay}s infinite`,
            }}
            aria-hidden="true"
          >
            {piece.symbol}
          </span>
        ))}

        {/* Content container — vertically centered */}
        <div className="relative z-10 flex flex-1 flex-col justify-center">
          {/* Logo */}
          <div className="mb-12">
            <span className="font-display text-[16px] font-semibold text-gold-primary">
              {'\u265E'} ChessIQ Analytics
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-[36px] font-bold leading-tight text-text-primary">
            Every move tells a story.
          </h1>

          {/* Subtext */}
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-text-secondary">
            Uncover the hidden patterns in your chess games with data-driven
            insights and analytics.
          </p>

          {/* Features inline */}
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-text-secondary">
            <span className="text-gold-primary">{'\u265F'}</span> Player performance{' '}
            <span className="text-text-tertiary">&middot;</span>{' '}
            <span className="text-gold-primary">{'\u265F'}</span> Opening analysis{' '}
            <span className="text-text-tertiary">&middot;</span>{' '}
            <span className="text-gold-primary">{'\u265F'}</span> Real-time analytics
          </p>
        </div>
      </div>

      {/* ── Right Panel — 40% — Form ── */}
      <div className="flex w-full flex-col justify-center bg-bg-surface px-10 py-12 lg:w-[40%] lg:border-l lg:border-border-subtle">
        <div className="mx-auto w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
