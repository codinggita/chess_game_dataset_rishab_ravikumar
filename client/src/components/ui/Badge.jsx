import clsx from 'clsx';

/* ── Variant map per design.md badge spec ──
   Each: [bg, text, border-color] with exact design tokens
   Prefixes: ♔ white-win, ♚ black-win, = draw
*/
const variantConfig = {
  'white-win': {
    bg: 'bg-accent-gold/8',
    text: 'text-accent-gold',
    border: 'border-accent-gold',
    prefix: '\u2654',
  },
  'black-win': {
    bg: 'bg-[rgba(85,85,106,0.12)]',
    text: 'text-text-secondary',
    border: 'border-[#55556A]',
    prefix: '\u265A',
  },
  draw: {
    bg: 'bg-[rgba(107,122,255,0.08)]',
    text: 'text-info-blue',
    border: 'border-info-blue',
    prefix: '\u003D',
  },
  checkmate: {
    bg: 'bg-[rgba(45,212,160,0.08)]',
    text: 'text-success-green',
    border: 'border-success-green',
    prefix: '',
  },
  resign: {
    bg: 'bg-[rgba(245,158,11,0.08)]',
    text: 'text-warning-amber',
    border: 'border-warning-amber',
    prefix: '',
  },
  timeout: {
    bg: 'bg-[rgba(240,82,82,0.08)]',
    text: 'text-error-red',
    border: 'border-error-red',
    prefix: '',
  },
  rated: {
    bg: 'bg-[rgba(124,77,255,0.08)]',
    text: 'text-[#7C4DFF]',
    border: 'border-[#7C4DFF]',
    prefix: '',
  },
  eco: {
    bg: 'bg-transparent',
    text: 'text-accent-gold',
    border: 'border-accent-gold',
    prefix: '',
  },
  pill: {
    bg: 'bg-accent-gold/10',
    text: 'text-accent-gold',
    border: 'border-accent-gold/30',
    prefix: '',
  },
  admin: {
    bg: 'bg-accent-gold/8',
    text: 'text-accent-gold',
    border: 'border-accent-gold',
    prefix: '',
  },
  user: {
    bg: 'bg-[rgba(53,53,74,0.12)]',
    text: 'text-text-secondary',
    border: 'border-border-strong',
    prefix: '',
  },
  active: {
    bg: 'bg-[rgba(45,212,160,0.08)]',
    text: 'text-success-green',
    border: 'border-success-green',
    prefix: '',
    dot: true,
  },
  banned: {
    bg: 'bg-[rgba(240,82,82,0.08)]',
    text: 'text-error-red',
    border: 'border-error-red',
    prefix: '',
  },
  'most-used': {
    bg: 'bg-accent-gold',
    text: 'text-[#0B0B0E]',
    border: 'border-transparent',
    prefix: '',
  },
  live: {
    bg: 'bg-accent-gold/10',
    text: 'text-accent-gold',
    border: 'border-accent-gold/25',
    prefix: '',
    pulsing: true,
  },
};

export default function Badge({ children, variant = 'pill', className }) {
  const cfg = variantConfig[variant];

  const isEco = variant === 'eco';
  const isPill = variant === 'pill';
  const isMostUsed = variant === 'most-used';
  const isLive = variant === 'live';
  const isActive = variant === 'active';

  return (
    <span
      className={clsx(
        'inline-flex items-center border px-[7px] py-[2px] text-[11px] font-medium uppercase leading-none tracking-[0.04em]',
        cfg.bg,
        cfg.text,
        cfg.border,
        isEco && 'font-mono rounded-[2px]',
        isPill && 'rounded-full px-3 py-[3px]',
        isMostUsed && 'rounded-[3px] text-[10px]',
        isLive && 'rounded-full px-3 py-[3px]',
        !isPill && !isMostUsed && !isLive && 'rounded-[3px]',
        className,
      )}
    >
      {isActive && (
        <span className="mr-[4px] h-[6px] w-[6px] rounded-full bg-success-green animate-pulse" />
      )}
      {isLive && (
        <span className="mr-[4px] h-[6px] w-[6px] rounded-full bg-accent-gold animate-pulse" />
      )}
      {cfg.prefix && <span className="mr-[3px]">{cfg.prefix}</span>}
      {children}
    </span>
  );
}
