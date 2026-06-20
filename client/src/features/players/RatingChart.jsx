import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export default function RatingChart({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
        <span className="font-mono text-text-tertiary text-[13px]">
          No rating history recorded.
        </span>
      </div>
    );
  }

  // Format data for chart
  const data = [...history]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: '2-digit',
      }),
      rawDate: item.date,
      Rating: item.rating,
    }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="rounded border border-border-strong bg-bg-elevated p-3 shadow-xl font-mono text-[12px] text-text-primary">
          <p className="font-semibold text-gold-primary">{dataPoint.date}</p>
          <p className="mt-1">
            Rating: <strong className="text-text-primary">{dataPoint.Rating}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#252530" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#55556a"
            tick={{ fill: '#8c8ca0', fontSize: 10, fontFamily: 'monospace' }}
            dy={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#55556a"
            tick={{ fill: '#8c8ca0', fontSize: 10, fontFamily: 'monospace' }}
            dx={-5}
            axisLine={false}
            tickLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#c9a84c', strokeWidth: 1, strokeDasharray: '3 3' }} />
          <Line
            type="monotone"
            dataKey="Rating"
            stroke="#c9a84c"
            strokeWidth={2}
            dot={{ r: 3, fill: '#c9a84c', stroke: '#c9a84c', strokeWidth: 1 }}
            activeDot={{ r: 5, fill: '#c9a84c', stroke: '#131318', strokeWidth: 2, className: 'glow-critical' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
