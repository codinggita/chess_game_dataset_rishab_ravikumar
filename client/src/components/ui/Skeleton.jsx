import clsx from 'clsx';

/* ── Skeleton shimmer animation ──
   Design spec:
   Base color:    #1A1A22
   Shimmer:       rgba(201,168,76,0.06)
   Animation:     shimmer sweep left to right, 1.5s infinite
   Border-radius: match element being loaded
*/
const variantStyles = {
  text: 'h-3 w-full rounded-[2px]',
  number: 'h-10 w-[120px] rounded-[4px]',
  card: 'h-48 w-full rounded-lg',
  'table-row': 'h-12 w-full rounded-[4px]',
  avatar: 'h-8 w-8 rounded-full',
};

export default function Skeleton({ variant = 'text', count = 1, className, ...props }) {
  const base =
    'relative overflow-hidden bg-[#1A1A22] before:absolute before:inset-0 before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-[rgba(201,168,76,0.06)] before:to-transparent before:translate-x-[-100%]';

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="flex flex-col gap-3" {...props}>
      {items.map((i) => (
        <div key={i} className={clsx(base, variantStyles[variant], className)} aria-hidden="true" />
      ))}
    </div>
  );
}
