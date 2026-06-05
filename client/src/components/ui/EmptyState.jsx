import clsx from 'clsx';
import Button from './Button';

/* ── EmptyState per design.md spec ──
   Chess piece 80px, text-tertiary, opacity 0.4
   Title 18px/500, Body 14px, optional CTA
*/
export default function EmptyState({
  piece = '\u265F',
  title = 'No data found',
  body = 'Try adjusting your filters or add a new item.',
  ctaLabel,
  onCtaClick,
  className,
  ...props
}) {
  return (
    <div
      className={clsx('flex flex-col items-center px-6 py-16 text-center', className)}
      {...props}
    >
      <span
        className="mb-6 select-none leading-none"
        style={{ fontSize: '80px', opacity: 0.4, color: '#55556A' }}
        aria-hidden="true"
      >
        {piece}
      </span>

      {title && <h3 className="text-[18px] font-medium text-text-secondary">{title}</h3>}

      {body && <p className="mt-2 max-w-sm text-[14px] text-text-tertiary">{body}</p>}

      {ctaLabel && onCtaClick && (
        <Button variant="primary" className="mt-6" onClick={onCtaClick}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
