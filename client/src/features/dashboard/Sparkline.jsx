/* ── Sparkline ──
   Recharts LineChart, 120×48px, no axes/grid, gold line only.
   Used inside the featured hero stat card.
*/

import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function Sparkline({ data = [] }) {
  if (!data.length) return null;

  return (
    <div className="h-12 w-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#C9A84C"
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
