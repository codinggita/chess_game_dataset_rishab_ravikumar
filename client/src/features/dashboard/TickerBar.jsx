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
          matches !== null ? { label: 'Total Matches', value: Number(matches).toLocaleString() } : null,
          players !== null ? { label: 'Total Players', value: Number(players).toLocaleString() } : null,
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
    return <div className="h-9 animate-pulse bg-bg-elevated border-t border-b border-[#1E1E28]" />;
  }

  /* ── No data available ── */
  if (items.length === 0) return null;

  const renderItems = () => (
    <>
      {items.map((item, idx) => (
        <span key={idx} className="inline-block font-mono text-[13px] px-6">
          <span className="text-text-secondary">{item.label}: </span>
          <span className="text-gold-primary font-semibold">{item.value}</span>
        </span>
      ))}
      <span className="text-text-secondary px-6">•</span>
    </>
  );

  return (
    <div className="relative h-9 overflow-hidden bg-bg-deep border-t border-b border-[#1E1E28]">
      <div className="animate-ticker whitespace-nowrap py-[7px] inline-block">
        <div className="inline-block">
          {renderItems()}
        </div>
        <div className="inline-block">
          {renderItems()}
        </div>
      </div>
    </div>
  );
}
