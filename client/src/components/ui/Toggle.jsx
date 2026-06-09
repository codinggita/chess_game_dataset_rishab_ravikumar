import clsx from 'clsx';

/* ── Toggle per PRD spec (§5.1) ──
   40×22px track, 18px circle, gold active
*/

export default function Toggle({ checked, onChange, label, disabled, className }) {
  return (
    <label className={clsx('inline-flex items-center gap-3', disabled && 'pointer-events-none opacity-40', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={clsx(
          'relative inline-flex h-[22px] w-[40px] flex-shrink-0 rounded-full border transition-colors duration-200',
          checked
            ? 'bg-gold-primary border-gold-primary'
            : 'bg-transparent border-border-subtle',
        )}
      >
        <span
          className={clsx(
            'absolute top-[2px] left-[2px] h-[16px] w-[16px] rounded-full bg-white transition-transform duration-200',
            checked && 'translate-x-[19px]',
          )}
        />
      </button>
      {label && <span className="text-[13px] text-text-primary">{label}</span>}
    </label>
  );
}
