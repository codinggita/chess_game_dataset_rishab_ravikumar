import MuiSelect from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import clsx from 'clsx';

/* ── Select per PRD spec ──
   MUI Select wrapper, dark menu (via MUI theme), gold focus
*/
export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  fullWidth,
  className,
  ...props
}) {
  return (
    <FormControl size="small" error={!!error} fullWidth={fullWidth} className={clsx(className)}>
      {label && <InputLabel>{label}</InputLabel>}
      <MuiSelect
        value={value || ''}
        onChange={onChange}
        displayEmpty={!!placeholder}
        renderValue={!value && placeholder ? () => placeholder : undefined}
        label={label}
        {...props}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options.map((opt) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          return (
            <MenuItem key={optValue} value={optValue}>
              {optLabel}
            </MenuItem>
          );
        })}
      </MuiSelect>
      {error && <p className="mt-1 text-[11px] text-error-red">{error}</p>}
    </FormControl>
  );
}
