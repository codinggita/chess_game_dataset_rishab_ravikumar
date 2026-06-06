import { useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';

/* ── Modal per design.md spec ──
   Variants: default | delete
   Backdrop: rgba(0,0,0,0.75) + blur(4px)
   Card: bg #1A1A22, border #35354A, radius 8px, max-w 560px
   Focus trap, Escape/backdrop close, body scroll lock
*/
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  variant = 'default',
  className,
  ...props
}) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const prevFocusRef = useRef(null);

  // ── Body scroll lock ──
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ── Focus trap + restore ──
  useEffect(() => {
    if (!isOpen) return;

    prevFocusRef.current = document.activeElement;

    const modal = modalRef.current;
    if (modal) {
      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length) {
        focusable[0].focus();
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !modal) return;

      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (prevFocusRef.current) {
        prevFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // ── Backdrop click ──
  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose],
  );

  if (!isOpen) return null;

  const isDelete = variant === 'delete';

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.75)] backdrop-blur-sm"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={clsx(
          'w-[90vw] max-w-[560px] animate-[fade-in-up_200ms_ease-out] rounded-lg border bg-bg-elevated p-0',
          'border-border-strong',
          isDelete && 'max-w-[400px] text-center',
          className,
        )}
        {...props}
      >
        {/* ── Header ── */}
        <div
          className={clsx(
            'flex items-center justify-between border-b border-border-default px-6 pb-4 pt-5',
            isDelete && 'border-none pb-0 pt-8',
          )}
        >
          {isDelete ? (
            <div className="w-full">
              <div className="mb-4 flex justify-center">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-error-red/10 text-xl"
                  aria-hidden="true"
                >
                  ⚠
                </span>
              </div>
              <h2 className="text-center text-[18px] font-medium text-text-primary">{title}</h2>
            </div>
          ) : (
            <>
              <h2 className="text-[16px] font-semibold text-text-primary">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary"
              >
                ✕
              </button>
            </>
          )}
        </div>

        {/* ── Body ── */}
        <div className={clsx('px-6', isDelete ? 'pb-2 pt-4' : 'py-6')}>{children}</div>

        {/* ── Footer ── */}
        {footer && (
          <div
            className={clsx(
              'flex gap-2 px-6 pb-5 pt-4',
              isDelete ? 'justify-center' : 'justify-end',
              !isDelete && 'border-t border-border-default',
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
