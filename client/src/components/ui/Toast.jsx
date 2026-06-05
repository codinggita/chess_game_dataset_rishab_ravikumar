/* eslint-disable react-refresh/only-export-components */
import toast from 'react-hot-toast';
import clsx from 'clsx';

/* ── Toast per design.md spec ──
   320px, bg #1A1A22, 3px left border, icon, close X,
   progress bar (2px, 4s shrink), auto-dismiss 4s
*/
const typeConfig = {
  success: {
    icon: '\u2713',
    borderColor: 'border-l-success-green',
    iconColor: 'text-success-green',
    progressColor: 'bg-success-green',
  },
  error: {
    icon: '\u2717',
    borderColor: 'border-l-error-red',
    iconColor: 'text-error-red',
    progressColor: 'bg-error-red',
  },
  warning: {
    icon: '\u26A0',
    borderColor: 'border-l-warning-amber',
    iconColor: 'text-warning-amber',
    progressColor: 'bg-warning-amber',
  },
  info: {
    icon: '\u2139',
    borderColor: 'border-l-info-blue',
    iconColor: 'text-info-blue',
    progressColor: 'bg-info-blue',
  },
};

function ToastContent({ type, title, body, onClose }) {
  const cfg = typeConfig[type];

  return (
    <div
      className={clsx(
        'relative flex w-[320px] items-start gap-3 overflow-hidden rounded-lg border border-border-subtle bg-bg-elevated p-4',
        'border-l-3',
        'shadow-[0_4px_12px_rgba(0,0,0,0.3)]',
        'animate-[fade-in-up_200ms_ease-out]',
        cfg.borderColor,
      )}
    >
      {/* Icon */}
      <span className={clsx('mt-px text-base leading-none', cfg.iconColor)}>{cfg.icon}</span>

      {/* Text */}
      <div className="flex-1">
        {title && (
          <p className="text-[14px] font-medium leading-tight text-text-primary">{title}</p>
        )}
        {body && <p className="mt-1 text-[13px] leading-snug text-text-secondary">{body}</p>}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-text-tertiary transition-colors hover:text-text-primary"
      >
        ✕
      </button>

      {/* Progress bar */}
      <span
        className={clsx(
          'absolute bottom-0 left-0 h-[2px] animate-[toast-progress_4s_linear]',
          cfg.progressColor,
        )}
      />
    </div>
  );
}

export function showToast(type, { title, body, duration = 4000 }) {
  toast.custom(
    (t) => (
      <ToastContent type={type} title={title} body={body} onClose={() => toast.dismiss(t.id)} />
    ),
    { duration, position: 'top-right' },
  );
}
