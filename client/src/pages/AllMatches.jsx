import { usePageMeta } from '../hooks/usePageMeta';

export default function AllMatches() {
  usePageMeta('Matches');

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">Matches</h1>
      <p className="mt-2 text-[13px] text-text-tertiary">
        All Matches placeholder — PR 13
      </p>
    </div>
  );
}
