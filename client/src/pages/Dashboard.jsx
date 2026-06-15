import { usePageMeta } from '../hooks/usePageMeta';

export default function Dashboard() {
  usePageMeta('Dashboard');

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">Dashboard</h1>
      <p className="mt-2 text-[13px] text-text-tertiary">
        Dashboard placeholder — PR 13
      </p>
    </div>
  );
}
