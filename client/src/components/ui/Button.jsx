import { forwardRef } from 'react';
import clsx from 'clsx';

/* ── Button variants per PRD spec (§5.1) ── */
const variantStyles = {
  primary: 'bg-gold-primary text-[#0B0B0E] border-none hover:brightness-110 active:brightness-90',
  secondary:
    'bg-transparent text-gold-primary border border-gold-primary hover:bg-gold-primary/8 active:brightness-90',
  danger: 'bg-data-negative text-white border-none hover:brightness-90 active:brightness-75',
  ghost:
    'bg-transparent text-text-primary border border-border-strong hover:border-text-tertiary hover:bg-bg-surface',
  icon: 'bg-transparent text-text-secondary border border-border-subtle hover:bg-bg-elevated hover:text-gold-primary',
};

const sizeStyles = {
  sm: 'h-7 text-[13px] px-3',
  md: 'h-9 text-[14px] px-4',
  lg: 'h-11 text-[14px] px-8',
};

const Button = forwardRef(
  ({ variant = 'primary', size = 'md', disabled, loading, children, className, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          'inline-flex items-center justify-center gap-2 rounded-[4px] font-ui font-medium uppercase tracking-[0.05em] transition-all duration-150 ease-in-out',
          'focus-visible:outline-2 focus-visible:outline-gold-primary focus-visible:outline-offset-2',
          variantStyles[variant],
          sizeStyles[size],
          variant === 'icon' &&
            {
              sm: 'w-7 px-0',
              md: 'w-8 px-0',
              lg: 'w-10 px-0',
            }[size],
          isDisabled && 'pointer-events-none opacity-40',
          className,
        )}
        {...props}
      >
        {loading && (
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
