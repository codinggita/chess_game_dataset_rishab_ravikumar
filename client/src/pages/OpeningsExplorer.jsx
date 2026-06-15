import { usePageMeta } from '../hooks/usePageMeta';

export default function OpeningsExplorer() {
  usePageMeta('Openings Explorer');

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">Openings Explorer</h1>
      <p className="mt-2 text-[13px] text-text-tertiary">
        Openings placeholder — PR 13
      </p>
    </div>
  );
}
