import clsx from 'clsx';

/* ── Breadcrumb per design.md spec ──
   Items: [{ label, href? }]
   Separator: / in text-tertiary
   Current (last): text-primary, non-clickable
   Parents: text-secondary, clickable
   Font: 14px Inter
*/
export default function Breadcrumb({ items, className, ...props }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx('flex items-center gap-2 text-[14px]', className)}
      {...props}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;

        return (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-text-tertiary" aria-hidden="true">
                /
              </span>
            )}
            {isLast ? (
              <span className="text-text-primary" aria-current="page">
                {item.label}
              </span>
            ) : (
              <a
                href={item.href || '#'}
                className="text-text-secondary transition-colors hover:text-text-primary"
              >
                {item.label}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}
