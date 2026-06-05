import { forwardRef } from 'react';
import clsx from 'clsx';

const variantStyles = {
  primary:
    'bg-accent-gold text-[#0B0B0E] border border-accent-gold hover:bg-accent-gold-hover active:brightness-90',
  secondary:
    'bg-transparent text-text-primary border border-border-default hover:border-accent-gold hover:text-accent-gold active:brightness-90',
  danger:
    'bg-transparent text-error-red border border-error-red hover:bg-error-red hover:text-white active:brightness-90',
  ghost:
    'bg-transparent text-text-secondary border border-transparent hover:text-text-primary hover:bg-bg-hover',
  icon: 'bg-transparent text-text-secondary border border-transparent hover:text-accent-gold hover:bg-bg-hover',
};

const sizeStyles = {
  sm: 'h-7 text-[11px] px-3',
  md: 'h-9 text-[12px] px-4',
  lg: 'h-11 text-[13px] px-6',
};

const iconSize = { sm: 28, md: 36, lg: 44 };

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
