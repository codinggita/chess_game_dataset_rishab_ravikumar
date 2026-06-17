/* ── Dashboard Page ──
   PR 20: Asymmetric hero stats section.
   PR 21: Charts + Widgets + Ticker + Latest Matches.
   Grid layout: HeroStats → row 2 → row 3 → TickerBar → LatestMatches.
*/

import { usePageMeta } from '../hooks/usePageMeta';
import PageHeader from '../components/ui/PageHeader';
import {
  HeroStats,
  VictoryChart,
  ColorAdvantage,
  TopOpenings,
  TimeControlChart,
  ActivityLog,
  TickerBar,
  LatestMatches,
} from '../features/dashboard';

export default function Dashboard() {
  usePageMeta('Dashboard');

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Dashboard"
        description="Grandmaster's War Room — live chess analytics"
      />

      <HeroStats />

      {/* Row 2: Charts — 60/40 on lg+, stacked on md/sm */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7">
          <VictoryChart />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <ColorAdvantage />
        </div>
      </div>

      {/* Row 3: 3 panels — 40/30/30 on lg+, wrapped on md, stacked on sm */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-12 lg:col-span-5">
          <TopOpenings />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <TimeControlChart />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <ActivityLog />
        </div>
      </div>

      {/* Ticker Bar — between row 3 and table */}
      <TickerBar />

      {/* Row 4: Latest Matches — full width */}
      <LatestMatches />
    </div>
  );
}
