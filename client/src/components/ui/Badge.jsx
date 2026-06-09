import clsx from 'clsx';

/* ── Variant map per PRD badge spec (§5.1) ──
   Each: [bg, text, border-color] with exact design tokens
   Prefixes: ♔ white-win, ♚ black-win, = draw
   13 variants — 9 from PRD + 4 extended for admin/status UI
*/
const variantConfig = {
  'white-win': {
    bg: 'bg-gold-primary/8',
    text: 'text-gold-primary',
    border: 'border-gold-primary',
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
    text: 'text-data-neutral',
    border: 'border-data-neutral',
    prefix: '\u003D',
  },
  checkmate: {
    bg: 'bg-[rgba(45,212,160,0.08)]',
    text: 'text-data-positive',
    border: 'border-data-positive',
    prefix: '',
  },
  resign: {
    bg: 'bg-[rgba(245,158,11,0.08)]',
    text: 'text-data-warning',
    border: 'border-data-warning',
    prefix: '',
  },
  timeout: {
    bg: 'bg-[rgba(240,82,82,0.08)]',
    text: 'text-data-negative',
    border: 'border-data-negative',
    prefix: '',
  },
  rated: {
    bg: 'bg-[rgba(124,77,255,0.08)]',
    text: 'text-purple-primary',
    border: 'border-purple-primary',
    prefix: '',
  },
  eco: {
    bg: 'bg-transparent',
    text: 'text-gold-primary',
    border: 'border-gold-primary',
    prefix: '',
  },
  pill: {
    bg: 'bg-gold-primary/10',
    text: 'text-gold-primary',
    border: 'border-gold-primary/30',
    prefix: '',
  },
  admin: {
    bg: 'bg-gold-primary/8',
    text: 'text-gold-primary',
    border: 'border-gold-primary',
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
    text: 'text-data-positive',
    border: 'border-data-positive',
    prefix: '',
    dot: true,
  },
  banned: {
    bg: 'bg-[rgba(240,82,82,0.08)]',
    text: 'text-data-negative',
    border: 'border-data-negative',
    prefix: '',
  },
  'most-used': {
    bg: 'bg-gold-primary',
    text: 'text-[#0B0B0E]',
    border: 'border-transparent',
    prefix: '',
  },
  live: {
    bg: 'bg-gold-primary/10',
    text: 'text-gold-primary',
    border: 'border-gold-primary/25',
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
        <span className="mr-[4px] h-[6px] w-[6px] rounded-full bg-data-positive animate-pulse" />
      )}
      {isLive && (
        <span className="mr-[4px] h-[6px] w-[6px] rounded-full bg-gold-primary animate-pulse" />
      )}
      {cfg.prefix && <span className="mr-[3px]">{cfg.prefix}</span>}
      {children}
    </span>
  );
}
