import clsx from 'clsx';

/* ── FilterBar per PRD spec (§5.1) ──
   Groups of filter pill rows
   Active: gold bg #C9A84C, text #0B0B0E, × to clear
   Inactive: border, text-secondary
   "Clear all" link
*/
export default function FilterBar({ groups, onClearAll, className, ...props }) {
  const hasActive = groups.some((g) => g.options.some((o) => o.active));

  return (
    <div className={clsx('flex flex-wrap items-start gap-4', className)} {...props}>
      {groups.map((group) => (
        <div key={group.label} className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-tertiary">
            {group.label}:
          </span>
          <div className="flex flex-wrap gap-1">
            {group.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => group.onChange(opt.value)}
                className={clsx(
                  'inline-flex items-center gap-1 rounded-[4px] px-2.5 py-1 text-[11px] font-medium uppercase transition-colors',
                  opt.active
                    ? 'bg-gold-primary text-[#0B0B0E]'
                    : 'border border-border-subtle bg-transparent text-text-secondary hover:bg-gold-primary/8 hover:border-gold-primary hover:text-gold-primary',
                )}
              >
                {opt.label}
                {opt.active && (
                  <span
                    className="ml-1 cursor-pointer text-current opacity-70 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      group.onChange(null);
                    }}
                  >
                    ✕
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {hasActive && onClearAll && (
        <button
          onClick={onClearAll}
          className="mt-[2px] text-[11px] text-text-tertiary underline transition-colors hover:text-text-primary"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
