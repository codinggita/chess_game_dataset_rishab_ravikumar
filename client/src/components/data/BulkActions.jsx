import clsx from 'clsx';
import { Button } from '../ui';

/* ── BulkActions per design.md spec ──
   Slides down when rows selected
   Shows count + action buttons
*/
export default function BulkActions({ selectedCount = 0, actions = [], className, ...props }) {
  if (!selectedCount) return null;

  return (
    <div
      className={clsx(
        'flex items-center gap-4 border border-border-subtle bg-bg-elevated px-4 py-3',
        'animate-[fade-in-up_150ms_ease-out]',
        className,
      )}
      {...props}
    >
      <span className="text-[13px] font-medium text-text-primary">{selectedCount} selected</span>

      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant || 'ghost'}
            size="sm"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
