import { useEffect, useRef } from 'react';
import clsx from 'clsx';

/* ── Modal per PRD spec (§5.1) ──
   Variants: default, delete-confirm
   Backdrop blur, Escape closes, focus trap
*/

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  variant = 'default',
  className,
}) {
  const modalRef = useRef(null);
  const isDelete = variant === 'delete-confirm';

  /* ── Escape to close ── */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  /* ── Focus trap ── */
  useEffect(() => {
    if (open) {
      setTimeout(() => modalRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.75)] backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={clsx(
          'w-full max-w-[460px] rounded-[8px] border border-border-strong bg-bg-elevated',
          'focus-visible:outline-none',
          className,
        )}
      >
        {/* ── Header ── */}
        <div
          className={clsx(
            'flex items-center justify-between border-b px-6 pb-4 pt-5',
            isDelete ? 'border-b-data-negative/30' : 'border-b-border-subtle',
          )}
        >
          <div className="flex items-center gap-3">
            {isDelete && (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-data-negative/10 text-xl">
                ⚠
              </span>
            )}
            <h2 className="text-[16px] font-semibold text-text-primary">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-[4px] text-text-tertiary hover:bg-bg-hover hover:text-text-primary"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5">{children}</div>

        {/* ── Footer ── */}
        {footer && (
          <div
            className={clsx(
              'flex items-center justify-end gap-3 px-6 pb-5 pt-0',
              !isDelete && 'border-t border-border-subtle pt-4',
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
