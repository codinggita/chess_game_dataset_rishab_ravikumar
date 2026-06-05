import clsx from 'clsx';

const variantStyles = {
  'white-win': 'bg-[#1C2A1C] text-[#4ADE80] border-[#4ADE80]/30',
  'black-win': 'bg-[#1C1C24] text-[#94A3B8] border-[#94A3B8]/30',
  draw: 'bg-[#1C2433] text-[#60A5FA] border-[#60A5FA]/30',
  checkmate: 'bg-[#2A1C1C] text-[#F87171] border-[#F87171]/30',
  resign: 'bg-[#2A2420] text-[#FBBF24] border-[#FBBF24]/30',
  timeout: 'bg-[#1C1C24] text-[#9CA3AF] border-[#9CA3AF]/30',
  rated: 'bg-[#1C2420] text-[#34D399] border-[#34D399]/30',
  eco: 'bg-[#1C1C1C] text-[#C9A84C] border-[#C9A84C]/40 font-mono',
  pill: 'bg-accent-gold/10 text-accent-gold border-accent-gold/30 rounded-full px-3',
};

export default function Badge({ children, variant = 'pill', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center border px-[6px] py-[2px] text-[11px] font-semibold uppercase leading-none tracking-[0.04em]',
        'rounded-[3px]',
        variant === 'pill' && 'rounded-full px-3 py-[3px]',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
