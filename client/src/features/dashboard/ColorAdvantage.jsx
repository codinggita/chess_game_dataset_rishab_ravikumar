/* ── ColorAdvantage ──
   Half-donut RadialBarChart showing white/black win percentages.
   Fetches from analyticsService.getColorAdvantage().
   Backend: [{ color: 'white'|'black', count: N }]
*/

import { useEffect, useState } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { getColorAdvantage } from '../../services/analyticsService';

export default function ColorAdvantage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getColorAdvantage()
      .then((result) => {
        if (cancelled) return;

        /* Backend: [{ color: 'white', count: 9988 }, { color: 'black', count: 10070 }]
           Analytics unwrap returns { data: [...] } or [...] directly. */
        const raw = Array.isArray(result) ? result : result?.data || [];
        const whiteCount = raw.find((d) => d.color === 'white')?.count || 0;
        const blackCount = raw.find((d) => d.color === 'black')?.count || 0;
        const total = whiteCount + blackCount;
        const pct = total > 0 ? (whiteCount / total) * 100 : 50;

        setData([{ name: 'White', value: pct, fill: '#C9A84C' }]);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="h-[200px] animate-pulse rounded-[6px] bg-bg-elevated" />
    );
  }

  /* ── Empty / Error ── */
  if (!data) {
    return (
      <div className="rounded-[6px] border border-border-subtle bg-bg-surface p-5">
        <p className="text-[13px] text-text-tertiary">
          No color advantage data available.
        </p>
      </div>
    );
  }

  /* ── Chart ── */
  const whitePct = data[0]?.value ?? 50;
  const blackPct = 100 - whitePct;

  return (
    <div className="rounded-[6px] border border-border-subtle bg-bg-surface p-5">
      <h3 className="mb-2 text-[13px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
        Color Advantage
      </h3>

      <div className="relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height={180}>
          <RadialBarChart
            cx="50%"
            cy="100%"
            innerRadius="60%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
            barSize={12}
            data={data}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={6}
              background={{ fill: '#252530' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center percentage overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ marginTop: '-20px' }}
        >
          <span
            className="font-display text-[28px] font-bold text-gold-primary"
            style={{ fontFamily: 'var(--font-family-display)' }}
          >
            {whitePct.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Legend row */}
      <div className="mt-1 flex justify-center gap-6 text-[12px]">
        <span className="font-mono text-text-primary">
          White {whitePct.toFixed(1)}%
        </span>
        <span className="font-mono text-text-tertiary">
          Black {blackPct.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
