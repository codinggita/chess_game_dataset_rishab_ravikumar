import { usePageMeta } from '../hooks/usePageMeta';

export default function MatchView() {
  usePageMeta('Match View');

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">Match View</h1>
      <p className="mt-2 text-[13px] text-text-tertiary">
        Match detail placeholder — PR 13
      </p>
    </div>
  );
}
