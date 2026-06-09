import clsx from 'clsx';

/* ── Pagination per PRD spec (§5.1) ──
   32×32 buttons, active=gold filled, prev/next arrows
*/

export default function Pagination({ page, totalPages, total, pageSize, onPageChange, className }) {
  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, total);

  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <div className={clsx('flex items-center justify-between', className)}>
      <span className="font-mono text-[12px] text-text-tertiary">
        {startRecord}–{endRecord} of {total}
      </span>
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={handlePrev}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-border-subtle bg-transparent text-[13px] text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary disabled:pointer-events-none disabled:opacity-30"
          aria-label="Previous page"
        >
          ‹
        </button>
        {/* Page numbers */}
        {getPageNumbers().map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="flex h-8 w-8 items-center justify-center text-[12px] text-text-tertiary">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={clsx(
                'flex h-8 w-8 items-center justify-center rounded-[4px] text-[13px] font-mono transition-colors',
                p === page
                  ? 'border-none bg-gold-primary text-[#0B0B0E] font-semibold'
                  : 'border border-border-subtle bg-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
              )}
            >
              {p}
            </button>
          ),
        )}
        {/* Next */}
        <button
          onClick={handleNext}
          disabled={page >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-border-subtle bg-transparent text-[13px] text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary disabled:pointer-events-none disabled:opacity-30"
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}
