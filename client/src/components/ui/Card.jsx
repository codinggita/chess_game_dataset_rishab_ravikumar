import clsx from 'clsx';

const variantStyles = {
  default: 'bg-bg-surface border-border-default',
  featured: 'bg-bg-surface border-accent-gold',
  interactive:
    'bg-bg-surface border-border-default hover:bg-bg-elevated hover:border-border-strong cursor-pointer',
};

export default function Card({ children, variant = 'default', header, className, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-[6px] border p-5 transition-colors duration-150',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {header && (
        <div className="mb-4 border-b border-[#1E1E28] pb-3">
          <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-text-tertiary">
            {header}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
