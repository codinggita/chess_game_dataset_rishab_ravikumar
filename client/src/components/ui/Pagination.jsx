import clsx from 'clsx';

/* ── Pagination per design.md spec ──
   Page buttons: 32×32, border #252530, 13px mono
   Active: gold fill #C9A84C, text #0B0B0E
   Prev/Next: arrow icons, same style
   Info text: "Showing 1–10 of 20,058"
*/
export default function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
  ...props
}) {
  const start = totalItems ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, totalItems);

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className={clsx('flex items-center gap-1', className)} {...props}>
      {/* Info text */}
      {totalItems > 0 && (
        <span className="mr-4 text-[13px] text-text-secondary">
          Showing{' '}
          <span className="font-mono text-text-primary">
            {start}–{end}
          </span>{' '}
          of <span className="font-mono text-text-primary">{totalItems.toLocaleString()}</span>
        </span>
      )}

      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-border-subtle bg-transparent text-[13px] text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary disabled:pointer-events-none disabled:opacity-30"
      >
        ‹
      </button>

      {/* Page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={clsx(
            'flex h-8 w-8 items-center justify-center rounded-[4px] text-[13px] font-mono transition-colors',
            p === page
              ? 'border-none bg-accent-gold text-[#0B0B0E] font-semibold'
              : 'border border-border-subtle bg-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
          )}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-border-subtle bg-transparent text-[13px] text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary disabled:pointer-events-none disabled:opacity-30"
      >
        ›
      </button>
    </div>
  );
}
