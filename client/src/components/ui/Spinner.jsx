import clsx from 'clsx';

/* ── Spinner ──
   CSS rotation, 3 sizes, gold accent
   For inline loading states (full-page = Skeleton)
*/
const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-[2.5px]',
  lg: 'h-10 w-10 border-[3px]',
};

export default function Spinner({ size = 'md', className, ...props }) {
  return (
    <span
      className={clsx(
        'inline-block animate-spin rounded-full border-gold-primary/30 border-t-gold-primary',
        sizes[size],
        className,
      )}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </span>
  );
}
