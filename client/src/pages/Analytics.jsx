import { usePageMeta } from '../hooks/usePageMeta';

export default function Analytics() {
  usePageMeta('Analytics');

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">Analytics</h1>
      <p className="mt-2 text-[13px] text-text-tertiary">
        Analytics placeholder — PR 13
      </p>
    </div>
  );
}
