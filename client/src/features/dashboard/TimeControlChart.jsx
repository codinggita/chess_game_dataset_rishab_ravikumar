import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { getTimeControlUsage } from '../../services/analyticsService';

/* Backend: [{ timeClass: 'bullet'|'blitz'|'rapid'|'classical', count: N }] */
const TC_LABELS = {
  bullet: 'Bullet',
  blitz: 'Blitz',
  rapid: 'Rapid',
  classical: 'Classical',
};

export default function TimeControlChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getTimeControlUsage()
      .then((result) => {
        if (cancelled) return;
        /* Analytics unwrap returns { data: [...] } or [...] directly.
           Map backend `timeClass` → display `label` for XAxis. */
        const raw = Array.isArray(result) ? result : result?.data || [];
        const items = raw.map((d) => ({
          ...d,
          label: TC_LABELS[d.timeClass] || d.timeClass,
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

  if (loading) {
    return <div className="h-[200px] animate-pulse rounded-[6px] bg-bg-elevated" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-[6px] border border-border-subtle bg-bg-surface p-5">
        <p className="text-[13px] text-text-tertiary">No time control data available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[6px] border border-border-subtle bg-bg-surface p-5">
      <h3 className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
        Time Control
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
          <XAxis
            dataKey="label"
            tick={{ fill: '#8B8BA7', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Bar dataKey="count" fill="#C9A84C" radius={[4, 4, 0, 0]} barSize={36}>
            <LabelList
              dataKey="count"
              position="top"
              style={{
                fill: '#E8E8F0',
                fontSize: 12,
                fontFamily: 'var(--font-family-mono)',
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
