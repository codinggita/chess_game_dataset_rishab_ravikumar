/* ── Dashboard Page ──
   PR 20: Asymmetric hero stats section.
   More widgets added in PR 21.
*/

import { usePageMeta } from '../hooks/usePageMeta';
import PageHeader from '../components/ui/PageHeader';
import { HeroStats } from '../features/dashboard';

export default function Dashboard() {
  usePageMeta('Dashboard');

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Dashboard"
        description="Grandmaster's War Room — live chess analytics"
      />

      <HeroStats />
    </div>
  );
}
