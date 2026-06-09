import clsx from 'clsx';

/* ── Tabs per PRD spec (§5.1) ──
   Variants: underline (gold line), pill (gold filled)
*/

export default function Tabs({ tabs = [], activeTab, onChange, variant = 'underline', className }) {
  if (!tabs.length) return null;

  return (
    <div
      className={clsx(
        'flex items-center gap-0 overflow-x-auto',
        /* Hide scrollbar by default but allow scroll on touch */
        '[&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:bg-transparent',
        variant === 'underline' && 'border-b border-border-subtle',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        const id = typeof tab === 'string' ? tab : tab.value;
        const label = typeof tab === 'string' ? tab : tab.label;

        return (
          <button
            key={id}
            onClick={() => onChange?.(id)}
            className={clsx(
              'flex-shrink-0 px-4 py-2 text-[13px] font-medium uppercase tracking-[0.05em] transition-all duration-150',
              variant === 'underline' && [
                'border-b-2 text-text-secondary hover:text-text-primary',
                isActive ? 'border-gold-primary text-gold-primary' : 'border-transparent',
              ],
              variant === 'pill' && [
                'rounded-[4px] px-4 py-1.5',
                isActive
                  ? 'bg-gold-primary text-[#0B0B0E] font-semibold'
                  : 'text-text-secondary hover:text-text-primary',
              ],
            )}
            aria-selected={isActive}
            role="tab"
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
