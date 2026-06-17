/* ── TickerBar ──
   Continuously scrolling marquee of live stats.
   Positioned between HeroStats row and the table section.
   Keyframes live in styles/animations.css (@keyframes ticker-scroll).
   Utility class animate-ticker registered in styles/index.css.
*/

import { useEffect, useState } from 'react';
import { getTotalMatches, getTotalPlayers } from '../../services/statsService';

export default function TickerBar() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getTotalMatches().catch(() => null),
      getTotalPlayers().catch(() => null),
    ])
      .then(([matches, players]) => {
        if (cancelled) return;

        const tickerItems = [
          matches !== null ? `Total Matches: ${Number(matches).toLocaleString()}` : null,
          players !== null ? `Total Players: ${Number(players).toLocaleString()}` : null,
        ].filter(Boolean);

        setItems(tickerItems);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Skeleton ── */
  if (loading) {
    return <div className="h-9 animate-pulse bg-bg-elevated" />;
  }

  /* ── No data available ── */
  if (items.length === 0) return null;

  /* Duplicate for seamless infinite loop */
  const displayText = [...items, ...items].join('  \u2022  ');

  return (
    <div className="relative h-9 overflow-hidden bg-bg-deep">
      <div className="animate-ticker whitespace-nowrap py-[7px]">
        <span className="inline-block font-mono text-[13px] text-text-secondary px-4">
          {displayText}
        </span>
      </div>
    </div>
  );
}
