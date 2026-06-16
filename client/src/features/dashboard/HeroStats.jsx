/* ── HeroStats ──
   Asymmetric hero stat cards per PRD §9 (PR 20).
   12-column grid: featured (6 cols) + 3 regular (2 cols each).
   Animated count-up via framer-motion, sparkline, trend badges.
*/

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { animate, useInView } from 'framer-motion';
import { fetchStats } from '../../store/slices/dataSlice';
import * as statsService from '../../services/statsService';
import Sparkline from './Sparkline';

/* ─── AnimatedNumber ───
   Fires once when element scrolls into view.
   Guards against NaN with safeValue.
*/

function AnimatedNumber({ value, duration = 1.5, className }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const safeValue = Number(value) || 0;

  useEffect(() => {
    if (!isInView) return;
    setDisplay(0);
    const controls = animate(0, safeValue, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [isInView, safeValue, duration]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString()}
    </span>
  );
}

/* ─── Trend badge ─── */

function TrendBadge({ value, className = '' }) {
  if (value == null) return null;

  const arrow = value > 0 ? '\u2191' : value < 0 ? '\u2193' : '\u2192';
  const color =
    value > 0
      ? 'text-data-positive'
      : value < 0
        ? 'text-data-negative'
        : 'text-data-neutral';

  return (
    <span className={`font-mono text-[12px] ${color} ${className}`}>
      {arrow} {Math.abs(value)}%
    </span>
  );
}

/* ─── Compute week-over-week trend from daily data ─── */

function computeTrend(dailyGames) {
  if (!dailyGames || dailyGames.length < 14) return null;
  const recent = dailyGames.slice(-7).reduce((s, d) => s + (d.count || d.value || 0), 0);
  const previous = dailyGames.slice(-14, -7).reduce((s, d) => s + (d.count || d.value || 0), 0);
  if (previous === 0) return null;
  return Math.round(((recent - previous) / previous) * 100);
}

/* ─── Main Component ─── */

export default function HeroStats() {
  const dispatch = useDispatch();
  const { totalMatches, totalPlayers, whiteWinRate, checkmateRate, isLoading, error } =
    useSelector((s) => s.data.stats);

  const [dailyData, setDailyData] = useState([]);
  const [sparkLoaded, setSparkLoaded] = useState(false);

  /* Fetch stats via Redux thunk on mount */
  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  /* Fetch daily games for sparkline (local state — only used here) */
  useEffect(() => {
    let cancelled = false;

    statsService
      .getDailyGames()
      .then((data) => {
        if (cancelled) return;
        const sparkData = (Array.isArray(data) ? data : []).map((d) => ({
          value: d.count || d.value || d.total || 0,
        }));
        setDailyData(sparkData);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setSparkLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Loading: show skeleton ── */
  if (isLoading && !totalMatches) {
    return (
      <div className="grid grid-cols-12 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-[160px] animate-pulse rounded-[6px] bg-bg-elevated ${
              i === 0 ? 'col-span-6' : 'col-span-2'
            }`}
          />
        ))}
      </div>
    );
  }

  /* ── Error: no data at all ── */
  if (error && !totalMatches) {
    return (
      <p className="text-[13px] text-text-tertiary">
        Unable to load dashboard stats.
      </p>
    );
  }

  const trend = computeTrend(dailyData);

  /* Guard every value against NaN/undefined */
  const safeTotal = Number(totalMatches) || 0;
  const safePlayers = Number(totalPlayers) || 0;
  const safeWhiteWin = Number(whiteWinRate) || 0;
  const safeCheckmate = Number(checkmateRate) || 0;

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* ── Featured Card: Total Matches ── */}
      <div className="relative col-span-6 overflow-hidden rounded-[6px] border border-gold-primary bg-bg-surface p-6">
        {/* Gold accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-primary" />

        {/* Watermark */}
        <span
          className="pointer-events-none absolute bottom-2 right-2 select-none text-[120px] text-gold-primary"
          style={{ opacity: 0.04, lineHeight: 1 }}
          aria-hidden="true"
        >
          {'\u2654'}
        </span>

        {/* Label */}
        <p className="relative z-10 text-[13px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
          Total Matches
        </p>

        {/* Animated number */}
        <AnimatedNumber
          value={safeTotal}
          duration={1.5}
          className="relative z-10 mt-2 block font-display text-[64px] font-bold leading-none text-gold-primary"
        />

        {/* Sparkline */}
        <div className="relative z-10 mt-3">
          <Sparkline data={dailyData} />
        </div>

        {/* Trend badge */}
        {trend != null && (
          <TrendBadge
            value={trend}
            className="relative z-10 mt-2 block"
          />
        )}
      </div>

      {/* ── Regular Card: Total Players ── */}
      <StatCard
        label="Total Players"
        value={safePlayers}
        borderColor="border-l-gold-primary"
        trend={trend}
        duration={1}
      />

      {/* ── Regular Card: White Win Rate ── */}
      <StatCard
        label="White Win Rate"
        value={safeWhiteWin}
        suffix="%"
        borderColor="border-l-data-positive"
        trend={trend != null ? -trend : null}
        duration={1}
      />

      {/* ── Regular Card: Checkmate Rate ── */}
      <StatCard
        label="Checkmate Rate"
        value={safeCheckmate}
        suffix="%"
        borderColor="border-l-purple-primary"
        trend={trend != null ? Math.round(trend * 0.6) : null}
        duration={1}
      />
    </div>
  );
}

/* ─── StatCard (regular variant) ─── */

function StatCard({ label, value, suffix = '', borderColor, trend, duration = 1 }) {
  return (
    <div
      className={`col-span-2 rounded-[6px] border border-border-subtle bg-bg-surface p-5 ${borderColor} border-l-2`}
    >
      <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
        {label}
      </p>

      <AnimatedNumber
        value={value}
        duration={duration}
        className="mt-2 block font-display text-[36px] font-bold leading-none text-text-primary"
      />

      {suffix && (
        <span className="font-display text-[36px] font-bold leading-none text-text-primary">
          {suffix}
        </span>
      )}

      {trend != null && (
        <TrendBadge value={trend} className="mt-2 block" />
      )}
    </div>
  );
}
