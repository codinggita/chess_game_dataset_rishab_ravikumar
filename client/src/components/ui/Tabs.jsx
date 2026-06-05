import clsx from 'clsx';

/* ── Tabs per design.md spec ──
   Variants: underline | pill
   Underline: gold underline + gold text active
   Pill: gold bg active
*/
export default function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className,
  ...props
}) {
  return (
    <div
      className={clsx(
        'flex',
        variant === 'underline' && 'border-b border-border-subtle',
        variant === 'pill' && 'gap-1',
        className,
      )}
      role="tablist"
      {...props}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;
        const id = typeof tab === 'string' ? tab : tab.value;
        const label = typeof tab === 'string' ? tab : tab.label;

        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={clsx(
              'whitespace-nowrap px-4 py-2 text-[13px] font-medium transition-colors',
              variant === 'underline' && [
                'border-b-2 -mb-[1px]',
                isActive
                  ? 'border-accent-gold text-accent-gold'
                  : 'border-transparent text-text-secondary hover:text-text-primary',
              ],
              variant === 'pill' && [
                'rounded-[4px] px-4 py-1.5',
                isActive
                  ? 'bg-accent-gold text-[#0B0B0E] font-semibold'
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
              ],
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
