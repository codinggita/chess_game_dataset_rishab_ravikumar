/* ── LatestMatches ──
   Compact DataTable showing 10 most recent matches.
   Winner-coloured left border per row.
   Skeleton during fetch, empty state when no data.
   "View all →" footer link to /matches.
*/

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAll } from '../../services/matchService';

/* ─── Winner border utilities ─── */

function getBorderColorHex(winner) {
  if (winner === 'white') return '#C9A84C';
  if (winner === 'black') return '#35354A';
  return '#6B7AFF';
}

function truncateId(id) {
  if (!id) return '';
  const str = String(id);
  return str.length > 10 ? str.slice(0, 10) + '...' : str;
}

/* ─── Result badge variants ─── */

function ResultBadge({ winner }) {
  if (!winner) return <span className="text-text-tertiary">-</span>;

  const styles = {
    white: 'bg-gold-primary/10 text-gold-primary',
    black: 'bg-[#35354A]/50 text-text-primary',
    draw: 'bg-[#6B7AFF]/10 text-[#6B7AFF]',
  };

  return (
    <span
      className={`inline-block rounded-sm px-1.5 py-[1px] text-[10px] font-semibold uppercase ${
        styles[winner] || styles.draw
      }`}
    >
      {winner}
    </span>
  );
}

/* ─── Main Component ─── */

export default function LatestMatches() {
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getAll({ pageSize: 10 })
      .then((result) => {
        if (cancelled) return;

        /* Backend: { matches: [...] } via matchService.getAll unwrap */
        const items = result?.matches || (Array.isArray(result) ? result : []);

        setMatches(items);
      })
      .catch(() => {
        /* Silently fail — empty state will show */
      })
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
      <div className="h-[300px] animate-pulse rounded-[6px] bg-bg-elevated" />
    );
  }

  /* ── Empty state ── */
  if (!matches || matches.length === 0) {
    return (
      <div className="rounded-[6px] border border-border-subtle bg-bg-surface p-5">
        <p className="text-[13px] text-text-tertiary">No matches found.</p>
      </div>
    );
  }

  /* ── Data table ── */
  return (
    <div className="rounded-[6px] border border-border-subtle bg-bg-surface p-5">
      {/* Header */}
      <h3 className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
        Latest Matches
      </h3>

      {/* Scrollable table container */}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border-subtle text-[11px] uppercase tracking-[0.05em] text-text-tertiary">
              <th className="py-2 pr-2 text-left font-medium">ID</th>
              <th className="p-2 text-left font-medium">White</th>
              <th className="p-2 text-right font-medium">W.Rating</th>
              <th className="p-2 text-left font-medium">Black</th>
              <th className="p-2 text-right font-medium">B.Rating</th>
              <th className="p-2 text-left font-medium">Opening</th>
              <th className="p-2 text-left font-medium">Result</th>
              <th className="pl-2 text-right font-medium">Turns</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m, i) => (
              <tr
                key={m.id || m._id || i}
                className="border-l-2 border-b border-border-subtle/50 hover:bg-[#181820] hover:shadow-[inset_3px_0_0_rgba(201,168,76,0.5)] transition-all"
                style={{ borderLeftColor: getBorderColorHex(m.winner) }}
              >
                {/* ID — monospace, truncated */}
                <td className="py-2 pr-2 font-mono text-text-tertiary">
                  {truncateId(m.id || m._id)}
                </td>

                {/* White player */}
                <td className="p-2 text-text-primary">                  {m.white_id || '-'}</td>

                {/* White rating — monospace */}
                <td className="p-2 font-mono text-right text-text-secondary">
                  {m.white_rating ?? m.wRating ?? '-'}
                </td>

                {/* Black player */}
                <td className="p-2 text-text-primary">                  {m.black_id || '-'}</td>

                {/* Black rating — monospace */}
                <td className="p-2 font-mono text-right text-text-secondary">
                  {m.black_rating ?? m.bRating ?? '-'}
                </td>

                {/* Opening — ECO chip + name */}
                <td className="p-2">
                  <span className="inline-flex items-center gap-1">
                    {m.opening_eco && (
                      <span className="rounded-sm border border-gold-primary/40 px-1 py-[1px] text-[9px] font-mono uppercase text-gold-primary">
                        {m.opening_eco}
                      </span>
                    )}
                    <span className="max-w-[100px] truncate text-text-secondary">
                      {m.opening_name || m.opening || '-'}
                    </span>
                  </span>
                </td>

                {/* Result badge */}
                <td className="p-2">
                  <ResultBadge winner={m.winner} />
                </td>

                {/* Turns — monospace */}
                <td className="pl-2 font-mono text-right text-text-secondary">
                  {m.turns ?? m.num_moves ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer link */}
      <Link
        to="/matches"
        className="mt-4 block text-right text-[12px] font-medium text-gold-primary transition-colors hover:text-gold-primary/80"
      >
        View all &rarr;
      </Link>
    </div>
  );
}
