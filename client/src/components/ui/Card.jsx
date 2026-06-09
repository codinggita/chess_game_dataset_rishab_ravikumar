import clsx from 'clsx';

/* ── Card per PRD spec (§5.1) ──
   Variants: default, featured, interactive
   bg-surface, border-subtle, radius-lg
   featured=gold border
*/

const variantStyles = {
  default: 'bg-bg-surface border-border-subtle',
  featured: 'bg-bg-surface border-gold-primary',
  interactive:
    'bg-bg-surface border-border-subtle hover:bg-bg-elevated hover:border-border-strong cursor-pointer',
};

const paddingStyles = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  header,
  onClick,
  className,
  ...props
}) {
  const isInteractive = variant === 'interactive' || !!onClick;

  return (
    <div
      className={clsx(
        'rounded-[6px] border transition-all duration-150',
        variantStyles[variant],
        paddingStyles[padding],
        isInteractive && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      {...props}
    >
      {header && <div className="mb-4">{header}</div>}
      {children}
    </div>
  );
}
