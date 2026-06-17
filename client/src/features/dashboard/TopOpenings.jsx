/* ── TopOpenings ──
   Dashboard widget: ranked chess openings (1–8).
   Fetches from statsService.getTopOpenings().
   Each row: rank + ECO chip + opening name + count.
   "View All →" link navigates to /openings.
*/

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTopOpenings } from '../../services/statsService';

export default function TopOpenings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getTopOpenings()
      .then((result) => {
        if (cancelled) return;
        const items = Array.isArray(result) ? result : result?.data || [];
        setData(items.slice(0, 8));
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
      <div className="h-[400px] animate-pulse rounded-[6px] bg-bg-elevated" />
    );
  }

  /* ── Empty state ── */

  if (!data || data.length === 0) {
    return (
      <div className="rounded-[6px] border border-border-subtle bg-bg-surface p-5">
        <p className="text-[13px] text-text-tertiary">
          No opening data available.
        </p>
      </div>
    );
  }

  /* ── Data ── */

  return (
    <div className="rounded-[6px] border border-border-subtle bg-bg-surface p-5">
      <h3 className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
        Top Openings
      </h3>

      <div className="flex flex-col gap-2">
        {data.map((item, i) => (
          <div
            key={`${item.eco}-${item.name || i}-${i}`}
            className="flex items-center gap-3"
          >
            {/* Rank */}
            <span className="w-5 text-right text-[12px] font-mono text-text-tertiary">
              {i + 1}
            </span>

            {/* ECO chip */}
            <span className="inline-flex items-center rounded-sm border border-gold-primary/40 px-1.5 py-[1px] font-mono text-[10px] font-semibold uppercase tracking-[0.05em] text-gold-primary">
              {item.eco}
            </span>

            {/* Opening name */}
            <span className="flex-1 truncate text-[13px] text-text-primary">
              {item.name}
            </span>

            {/* Count (JetBrains Mono) */}
            <span className="font-mono text-[12px] text-text-secondary">
              {item.count?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* View All link */}
      <Link
        to="/openings"
        className="mt-4 block text-[12px] font-medium text-gold-primary transition-colors hover:text-gold-primary/80"
      >
        View All &rarr;
      </Link>
    </div>
  );
}
