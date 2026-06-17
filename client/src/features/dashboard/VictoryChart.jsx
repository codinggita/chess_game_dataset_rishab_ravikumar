/* ── VictoryChart ──
   Horizontal bar chart showing game victory distribution.
   4 bars: Resign, Mate, Timeout, Draw with per-category colors.
   Fetches data from analyticsService.getVictoryDistribution().
*/

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { getVictoryDistribution } from '../../services/analyticsService';

/* Backend returns: { status: 'resign'|'mate'|'outoftime'|'draw', count: N } */
const STATUS_LABELS = {
  resign: 'Resign',
  mate: 'Mate',
  outoftime: 'Timeout',
  draw: 'Draw',
};

const BAR_COLORS = {
  Resign: '#7C4DFF',
  Mate: '#C9A84C',
  Timeout: '#F59E0B',
  Draw: '#6B7AFF',
};

export default function VictoryChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getVictoryDistribution()
      .then((result) => {
        if (cancelled) return;
        /* Analytics unwrap returns { data: [...] } or [...] directly.
           Map backend `status` → display `label` for YAxis/BAR_COLORS. */
        const raw = Array.isArray(result) ? result : result?.data || [];
        const items = raw.map((d) => ({
          ...d,
          label: STATUS_LABELS[d.status] || d.status,
        }));
        setData(items);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Loading: skeleton ── */
  if (loading) {
    return (
      <div className="h-[200px] animate-pulse rounded-[6px] bg-bg-elevated" />
    );
  }

  /* ── Empty state ── */
  if (!data || data.length === 0) {
    return (
      <div className="rounded-[6px] border border-border-subtle bg-bg-surface p-5">
        <p className="text-[13px] text-text-tertiary">No victory data available.</p>
      </div>
    );
  }

  /* ── Victory distribution chart ── */
  return (
    <div className="rounded-[6px] border border-border-subtle bg-bg-surface p-5">
      <h3 className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
        Victory Distribution
      </h3>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: '#8B8BA7',
              fontSize: 12,
              fontFamily: 'var(--font-family-mono)',
            }}
            width={80}
          />
          <Tooltip
            contentStyle={{
              background: '#1A1A22',
              border: '1px solid #252530',
              borderRadius: '6px',
              fontSize: 12,
            }}
            labelStyle={{ color: '#E8E8F0' }}
            itemStyle={{ color: '#E8E8F0' }}
            cursor={{ fill: 'transparent' }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
            <LabelList
              dataKey="count"
              position="right"
              style={{
                fill: '#E8E8F0',
                fontSize: 12,
                fontFamily: 'var(--font-family-mono)',
              }}
            />
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={BAR_COLORS[entry.label] || '#C9A84C'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
