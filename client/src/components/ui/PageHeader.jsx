import clsx from 'clsx';
import Badge from './Badge';

/* ── PageHeader per PRD spec (§5.1) ──
   Title + gold count badge + right action buttons
   Used on every page (Dashboard, Matches, Players, etc.)
*/

export default function PageHeader({ title, subtitle, badge, count, actions, className }) {
  return (
    <div className={clsx('flex items-center justify-between', className)}>
      <div className="flex items-center gap-3">
        <h1 className="font-display text-[24px] font-semibold text-text-primary">{title}</h1>
        {badge && <Badge variant={badge.variant || 'pill'}>{badge.label}</Badge>}
        {count !== undefined && (
          <span className="font-mono text-[13px] text-gold-primary font-medium">{count}</span>
        )}
        {subtitle && (
          <span className="text-[13px] text-text-secondary">{subtitle}</span>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
