import clsx from 'clsx';

/* ── Toggle per PRD spec ──
   40×22px, gold active, slides
   Track: bg #252530, active gold
   Thumb: white circle
*/
export default function Toggle({ checked, onChange, disabled, label, className, ...props }) {
  return (
    <label
      className={clsx(
        'inline-flex items-center gap-3',
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
        className,
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative inline-flex items-center h-[22px] w-[40px] flex-shrink-0 rounded-full transition-colors duration-200',
          checked ? 'bg-accent-gold' : 'bg-border-default',
        )}
        {...props}
      >
        <span
          className={clsx(
            'inline-block h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-[20px]' : 'translate-x-[2px]',
          )}
        />
      </button>
      {label && <span className="text-[13px] text-text-primary">{label}</span>}
    </label>
  );
}
