import { forwardRef } from 'react';
import clsx from 'clsx';

/* ── Button variants per design.md spec ── */
const variantStyles = {
  primary: 'bg-accent-gold text-[#0B0B0E] border-none hover:brightness-110 active:brightness-90',
  secondary:
    'bg-transparent text-accent-gold border border-accent-gold hover:bg-accent-gold/8 active:brightness-90',
  danger: 'bg-error-red text-white border-none hover:brightness-90 active:brightness-75',
  ghost: 'bg-transparent text-text-secondary border-none hover:bg-bg-hover hover:text-text-primary',
  icon: 'bg-transparent text-text-secondary border border-border-strong hover:bg-bg-elevated hover:text-accent-gold',
};

const sizeStyles = {
  sm: 'h-7 text-[11px] px-3',
  md: 'h-9 text-[12px] px-4',
  lg: 'h-11 text-[13px] px-6',
};

const iconSize = { sm: 28, md: 32, lg: 40 };

const Button = forwardRef(
  ({ variant = 'primary', size = 'md', disabled, loading, children, className, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          'inline-flex items-center justify-center gap-2 rounded-[4px] font-ui font-semibold uppercase tracking-[0.05em] transition-all duration-150 ease-in-out',
          'focus-visible:outline-2 focus-visible:outline-accent-gold focus-visible:outline-offset-2',
          variantStyles[variant],
          sizeStyles[size],
          variant === 'icon' && `w-[${iconSize[size]}px]`,
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
