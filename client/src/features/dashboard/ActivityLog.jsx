import { useEffect, useState } from 'react';
import api from '../../services/api';

/* Backend: GET /system/logs → { data: { logs: [...], total }, meta } */
const STATUS_DOT = {
  '200': '#22C55E',
  '304': '#C9A84C',
  '404': '#F59E0B',
  '500': '#EF4444',
};

function stripAnsi(str) {
  /* Strip terminal escape codes like \u001b[0m, \u001b[32m, etc. */
  const esc = String.fromCharCode(27);
  return str.replace(new RegExp(esc + '\\[\\d*m', 'g'), '');
}

function dotColorFromMessage(msg) {
  const match = msg?.match(/(\d{3})/);
  return STATUS_DOT[match?.[1]] || '#6B7AFF';
}

export default function ActivityLog() {
  const [entries, setEntries] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api.get('/system/logs')
      .then((res) => {
        if (cancelled) return;
        /* res.data = { success, data: { logs: [...], total } } */
        const logs = res.data?.data?.logs || [];
        const mapped = logs.slice(0, 10).map((log) => ({
          dotColor: dotColorFromMessage(log.message),
          action: `${stripAnsi(log.method)} ${log.url}`,
          timestamp: log.timestamp,
        }));
        setEntries(mapped.length ? mapped : []);
      })
      .catch(() => setEntries([]))
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <div className="h-[280px] animate-pulse rounded-[6px] bg-bg-elevated" />;
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="rounded-[6px] border border-border-subtle bg-bg-surface p-5">
        <p className="text-[13px] text-text-tertiary">No recent activity.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[6px] border border-border-subtle bg-bg-surface p-5">
      <h3 className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
        Recent Activity
      </h3>
      <div
        className="activity-log flex flex-col gap-3 overflow-y-auto pr-2"
        style={{ maxHeight: '280px' }}
      >
        {entries.map((entry, i) => (
          <div key={i} className="flex items-start gap-3">
            <span
              className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
              style={{ backgroundColor: entry.dotColor }}
            />
            <div className="flex-1 min-w-0">
              <p className="truncate text-[13px] text-text-primary">{entry.action}</p>
              {entry.timestamp && (
                <p className="font-mono text-[11px] text-text-tertiary">
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
