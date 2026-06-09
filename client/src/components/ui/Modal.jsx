import { useEffect, useRef } from 'react';
import clsx from 'clsx';

/* ── Modal per PRD spec (§5.1) ──
   Variants: default, delete-confirm
   Backdrop blur, Escape closes, focus trap
   Responsive: 95vw mobile, bottom-sheet on xs, max-h 90vh scroll
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

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => modalRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
      <div
        className={clsx(
          'fixed inset-0 z-50 bg-[rgba(0,0,0,0.75)] backdrop-blur-sm',
          /* Below sm: bottom-sheet | sm+: centered */
          'flex items-end sm:items-center justify-center',
        )}
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
          /* Base: 95vw, capped at 460px, max 90vh */
          'w-[95vw] max-w-[460px] max-h-[90vh] flex flex-col',
          /* Desktop: 8px radius | <sm: bottom-sheet rounded top only */
          'rounded-t-[12px] sm:rounded-[8px]',
          'border border-border-strong bg-bg-elevated',
          'focus-visible:outline-none',
          className,
        )}
      >
        {/* ── Header (sticky) ── */}
        <div
          className={clsx(
            'flex items-center justify-between border-b px-6 pb-4 pt-5 flex-shrink-0',
            isDelete ? 'border-b-data-negative/30' : 'border-b-border-subtle',
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            {isDelete && (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-data-negative/10 text-xl flex-shrink-0">
                ⚠
              </span>
            )}
            <h2 className="text-[16px] font-semibold text-text-primary truncate">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-[4px] text-text-tertiary hover:bg-bg-hover hover:text-text-primary flex-shrink-0"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* ── Body (scrollable) ── */}
        <div className="overflow-y-auto px-6 py-5">{children}</div>

        {/* ── Footer ── */}
        {footer && (
          <div
            className={clsx(
              'flex items-center justify-end gap-3 px-6 pb-5 pt-0 flex-shrink-0 flex-wrap',
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
