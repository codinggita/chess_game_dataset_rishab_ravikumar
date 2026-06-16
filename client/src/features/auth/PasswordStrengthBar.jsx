/* ── PasswordStrengthBar ──
   Real-time password strength indicator.
   Score algorithm: length > 8 (+1), has uppercase (+1), has number (+1), has special char (+1)
   Max score = 4.
*/

import { useMemo } from 'react';

function getScore(password) {
  let score = 0;
  if (password.length > 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

const config = {
  0: { label: 'Weak', color: '#F05252', width: '25%' },
  1: { label: 'Weak', color: '#F05252', width: '25%' },
  2: { label: 'Fair', color: '#F59E0B', width: '50%' },
  3: { label: 'Fair', color: '#F59E0B', width: '50%' },
  4: { label: 'Strong', color: '#C9A84C', width: '100%' },
};

export default function PasswordStrengthBar({ password = '' }) {
  const score = useMemo(() => getScore(password), [password]);
  const { label, color, width } = config[score];

  if (!password) return null;

  return (
    <div className="mt-1">
      {/* Track */}
      <div className="h-[3px] w-full rounded-full bg-[#1E1E28]">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{ width, backgroundColor: color }}
        />
      </div>
      {/* Label */}
      <p
        className="mt-1 text-right font-mono text-[11px] tracking-wide"
        style={{ color }}
      >
        {label}
      </p>
    </div>
  );
}
