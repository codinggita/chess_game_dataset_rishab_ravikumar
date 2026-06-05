import { forwardRef, useState } from 'react';
import clsx from 'clsx';

const Input = forwardRef(
  ({ label, placeholder, type = 'text', error, icon, className, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={clsx('flex flex-col gap-1', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            placeholder={placeholder}
            className={clsx(
              'h-[38px] w-full rounded-[4px] border bg-bg-surface px-3 text-[13px] text-text-primary placeholder:text-text-tertiary transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-accent-gold/60 focus:border-accent-gold',
              error
                ? 'border-error-red ring-1 ring-error-red/40'
                : 'border-border-default hover:border-border-subtle',
              icon && 'pl-9',
              isPassword && 'pr-9',
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          )}
        </div>

        {error && <span className="text-[11px] text-error-red">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
