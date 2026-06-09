import { useState } from 'react';
import clsx from 'clsx';

/* ── Input per PRD spec (§5.1) ──
   38px h, gold focus ring, error=red border, password eye toggle
*/

export default function Input({
  label,
  placeholder,
  type = 'text',
  error,
  icon,
  register,
  disabled,
  className,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
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
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            'h-[38px] w-full rounded-[4px] border bg-bg-input px-3 text-[14px] text-text-primary placeholder:text-text-tertiary transition-all duration-150',
            'focus:outline-none focus:border-gold-primary focus:shadow-[0_0_0_2px_rgba(201,168,76,0.15)]',
            icon && 'pl-9',
            isPassword && 'pr-10',
            error
              ? 'border-data-negative shadow-[0_0_0_2px_rgba(240,82,82,0.15)]'
              : 'border-border-subtle hover:border-border-strong',
            disabled && 'pointer-events-none opacity-40',
          )}
          {...(register || {})}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁'}
          </button>
        )}
      </div>
      {error && <span className="text-[11px] text-data-negative">{error}</span>}
    </div>
  );
}
