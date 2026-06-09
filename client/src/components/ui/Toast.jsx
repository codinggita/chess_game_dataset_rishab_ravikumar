import toast from 'react-hot-toast';
import clsx from 'clsx';

/* ── Toast config per PRD spec ──
   Variants: success, error, warning, info
   Each has: 3px left border, progress bar, icon
   Responsive: 320px desktop, full-width-16px mobile, bottom-center
*/

const variantConfig = {
  success: {
    borderColor: 'border-l-data-positive',
    iconColor: 'text-data-positive',
    progressColor: 'bg-data-positive',
    icon: '✓',
  },
  error: {
    borderColor: 'border-l-data-negative',
    iconColor: 'text-data-negative',
    progressColor: 'bg-data-negative',
    icon: '✕',
  },
  warning: {
    borderColor: 'border-l-data-warning',
    iconColor: 'text-data-warning',
    progressColor: 'bg-data-warning',
    icon: '⚠',
  },
  info: {
    borderColor: 'border-l-data-neutral',
    iconColor: 'text-data-neutral',
    progressColor: 'bg-data-neutral',
    icon: 'ℹ',
  },
};

export function showToast(message, variant = 'info', duration = 4000) {
  const cfg = variantConfig[variant];
  const id = toast.custom(
    (t) => (
      <div
        className={clsx(
          'relative flex items-start gap-3 overflow-hidden rounded-[6px] border border-border-strong bg-bg-elevated p-4',
          /* Desktop: 320px | Mobile: full width minus 16px margin */
          'w-[calc(100vw-16px)] sm:w-[320px]',
          'shadow-[0_0_0_1px_rgba(201,168,76,0.08)]',
          t.visible ? 'animate-slide-in-up' : 'animate-fade-out',
          cfg.borderColor,
        )}
        style={{ borderLeftWidth: '3px' }}
      >
        <span className={clsx('mt-[1px] text-[14px] flex-shrink-0', cfg.iconColor)}>{cfg.icon}</span>
        <span className="flex-1 text-[13px] leading-[1.4] text-text-primary">{message}</span>
        <button
          onClick={() => toast.dismiss(id)}
          className="text-[14px] text-text-tertiary hover:text-text-primary flex-shrink-0"
          aria-label="Dismiss"
        >
          ✕
        </button>
        {/* Progress bar */}
        <span
          className={clsx('absolute bottom-0 left-0 h-[2px] animate-shrink-width', cfg.progressColor)}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    ),
    { duration },
  );
  return id;
}

export default toast;
